from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import csv
import requests

chromedriver_path = r"C:\Users\MBAns\Downloads\chromedriver-win64\chromedriver.exe"

options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')

service = Service(executable_path=chromedriver_path)
driver = webdriver.Chrome(service=service, options=options)

driver.get("https://www.actuarylist.com/")

try:
    WebDriverWait(driver, 15).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.Job_job-card__YgDAV"))
    )
except Exception as e:
    print("Job cards did not load in time:", e)
    driver.quit()
    exit()

allowed_countries = ["USA", "UK", "India", "Germany", "Canada", "Pakistan"]
job_elements = driver.find_elements(By.CSS_SELECTOR, "div.Job_job-card__YgDAV")
print(f"🔎 Found {len(job_elements)} job elements")

jobs_data = []
max_jobs = 10
count = 0

for elem in job_elements:
    if count >= max_jobs:
        break

    try:
        country_elem = elem.find_element(By.CSS_SELECTOR, "a.Job_job-card__country__GRVhK")
        country_text = country_elem.text.strip()
        country_clean = country_text.split()[-1]

        print(f"Job found in: {country_clean}")
        if country_clean not in allowed_countries:
            print(f" Skipping job in {country_clean}")
            continue

        title = elem.find_element(By.CSS_SELECTOR, "p.Job_job-card__position__ic1rc").text.strip()
        company = elem.find_element(By.CSS_SELECTOR, "p.Job_job-card__company__7T9qY").text.strip()

        try:
            city = elem.find_element(By.CSS_SELECTOR, "a.Job_job-card__location__bq7jX").text.strip()
        except:
            city = "Not Provided"

        try:
            salary = elem.find_element(By.CSS_SELECTOR, "p.Job_job-card__salary__QZswp").text.strip()
        except:
            salary = "Not Provided"

        job_page_link = elem.find_element(By.TAG_NAME, "a").get_attribute("href")

        main_tab = driver.current_window_handle
        driver.execute_script("window.open(arguments[0]);", job_page_link)
        WebDriverWait(driver, 10).until(lambda d: len(d.window_handles) > 1)
        job_detail_tab = [tab for tab in driver.window_handles if tab != main_tab][0]
        driver.switch_to.window(job_detail_tab)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        try:
            original_tabs = driver.window_handles.copy()
            apply_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Apply for this job')]"))
            )
            apply_button.click()

            WebDriverWait(driver, 10).until(lambda d: len(d.window_handles) > len(original_tabs))
            new_tab = [tab for tab in driver.window_handles if tab not in original_tabs][0]
            driver.switch_to.window(new_tab)
            WebDriverWait(driver, 10).until(EC.url_changes(job_page_link))
            apply_link = driver.current_url

            driver.close()
            driver.switch_to.window(job_detail_tab)

        except Exception as e:
            print(f" Could not get apply link: {e}")
            apply_link = job_page_link

        driver.close()
        driver.switch_to.window(main_tab)

        job_data = {
            "Title": title,
            "Company": company,
            "City": city,
            "Country": country_clean,
            "Salary": salary,
            "ApplyLink": apply_link
        }

        jobs_data.append(job_data)
        print(f"Saved job: {title} at {company}")
        count += 1

    except Exception as e:
        print(f" Error parsing job: {e}")
        handles = driver.window_handles
        for tab in handles:
            if tab != driver.current_window_handle:
                driver.switch_to.window(tab)
                driver.close()
        driver.switch_to.window(driver.window_handles[0])

driver.quit()

with open("filtered_jobs.csv", "w", newline="", encoding="utf-8") as csvfile:
    fieldnames = ["Title", "Company", "City", "Country", "Salary", "ApplyLink"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(jobs_data)

print(f"Saved {len(jobs_data)} jobs to filtered_jobs.csv")

api_url = "http://127.0.0.1:5000/jobs"

for job in jobs_data:
    payload = {
        "company_name": job["Company"],
        "email": "Not Provided",
        "city": job["City"],
        "country": job["Country"],
        "address": "Not Provided",
        "job_title": job["Title"],
        "job_type": "Full-time",
        "salary_range": job["Salary"],
        "apply_link": job["ApplyLink"],
        "description": f"{job['Title']} at {job['Company']} in {job['City']}, {job['Country']}."
    }

    try:
        response = requests.post(api_url, json=payload)
        if response.status_code == 201:
            print(f"Added to API: {job['Title']}")
        else:
            print(f"Failed to add to API: {job['Title']} — Status {response.status_code}")
    except Exception as e:
        print(f"API error for job '{job['Title']}': {e}")
