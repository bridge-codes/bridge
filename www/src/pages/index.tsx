import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        {/* <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div> */}
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  // const { siteConfig } = useDocusaurusContext();

  window.location.href = useBaseUrl('/docs/introduction');
  return null;

  // return (
  //   <Layout
  //     title={`Hello from ${siteConfig.title}`}
  //     description="Description will go into a meta tag in <head />"
  //   >
  //     <HomepageHeader />

  //     <main>
  //       <div className="text--center">COMING SOON</div>

  //       {/* <HomepageFeatures /> */}
  //     </main>
  //   </Layout>
  // );
}
