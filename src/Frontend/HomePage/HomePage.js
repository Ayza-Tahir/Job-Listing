import React, { useRef } from 'react';
import Header from '../Header/Header';
import JobListing from '../JobListing/JobListing';
import Footer from '../Footer/Footer';
import NavBar from '../NavBar/NavBar';

function HomePage() {
  const jobListRef = useRef(null);

  const scrollToJobList = () => {
    jobListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <NavBar onListJobsClick={scrollToJobList}/>
      <Header />
      <div ref={jobListRef}>
        <JobListing />
      </div>
      <Footer onListJobsClick={scrollToJobList} />
    </>
  );
}

export default HomePage;
