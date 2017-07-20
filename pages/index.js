import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const Index = () => (
  <Layout>
    <div>
      <Link href="/about">
        <a>About Page</a>
      </Link>
      <p>Hello Next.js</p>
    </div>
  </Layout>
);

export default Index;
