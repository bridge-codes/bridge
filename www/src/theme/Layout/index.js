import React from 'react';
import Layout from '@theme-original/Layout';
import mixpanel from 'mixpanel-browser';

export default function LayoutWrapper(props) {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // dev code
  } else {
      // production code
    mixpanel.init('0c100fcfe97943ac4ded12a1d1a8cc7f', {debug: true}); 
  }

  return (
    <>
      <Layout {...props} />
    </>
  );
}
