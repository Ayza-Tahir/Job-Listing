from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import time
import csv
import requests


chromedriver_path = r"C:\Users\MBAns\Downloads\chromedriver-win64\chromedriver.exe"


options = webdriver.ChromeOptions()
options.add_argument('--headless')  
service = Service(executable_path=chromedriver_path)
driver = webdriver.Chrome(service=service, options=options)

driver.get("https://www.actuarylist.com/")
time.sleep(5)  


allowed_countries = ["USA", "UK", "India", "Germany", "Canada", "Pakistan"]


job_elements = driver.find_elements(By.CSS_SELECTOR, "div.Job_job-card__YgDAV")


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

        if country_clean not in allowed_countries:
            continue

       
        title = elem.find_element(By.CSS_SELECTOR, "p.Job_job-card__position__ic1rc").text.strip()
        company = elem.find_element(By.CSS_SELECTOR, "p.Job_job-card__company__7T9qY").text.strip()
        city = elem.find_element(By.CSS_SELECTOR, "a.Job_job-card__location__bq7jX").text.strip()
        salary = elem.find_element(By.CSS_SELECTOR, "p.Job_job-card__salary__QZswp").text.strip()

        job_data = {
            "Title": title,
            "Company": company,
            "City": city,
            "Country": country_clean,
            "Salary": salary
        }
        jobs_data.append(job_data)
        count += 1

    except Exception as e:
        print(f"Error parsing job: {e}")

driver.quit()


with open("filtered_jobs.csv", "w", newline="", encoding="utf-8") as csvfile:
    fieldnames = ["Title", "Company", "City", "Country", "Salary"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(jobs_data)

print(f" Scraping complete. {len(jobs_data)} jobs saved to filtered_jobs.csv")


api_url = "http://127.0.0.1:5000/jobs"

for job in jobs_data:
    payload = {
        "company_name": job.get("Company", ""),
        "email": "bot@actuarylist.com",           
        "city": job.get("City", ""),
        "country": job.get("Country", ""),
        "address": "Not Provided",                
        "job_title": job.get("Title", ""),
        "job_type": "Full-time",                  
        "salary_range": job.get("Salary", ""),
        "description": f"{job.get('Title')} at {job.get('Company')} in {job.get('City')}, {job.get('Country')}."  # basic description
    }

    try:
        response = requests.post(api_url, json=payload)
        if response.status_code == 201:
            print(f" Added job: {payload['job_title']}")
        else:
            print(f"Failed to add job: {payload['job_title']}, Status: {response.status_code}, Message: {response.json()}")
    except Exception as e:
        print(f"Error sending job '{payload['job_title']}' to API: {e}")
