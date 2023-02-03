import React from 'react';
import Layout from '@theme-original/Layout';
import mixpanel from 'mixpanel-browser';
import { useLocation } from '@docusaurus/router';

export default function LayoutWrapper(props) {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
  } else {
    // production code
    mixpanel.init('0c100fcfe97943ac4ded12a1d1a8cc7f', { debug: true });
  }

  const location = useLocation();
  console.log(location)

  return (
    <>
      <Layout {...props} />
    </>
  );
}
