import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  async function fetchPosts() {
    await fetch(postsPagination.next_page)
      .then(res => res.json())
      .then(res => setPosts([...posts, ...res.results]));
    return 'ok';
  }
  return (
    <>
      <Head>
        <title>Spacetraveling</title>
      </Head>
      <main className={commonStyles.main}>
        <div className={commonStyles.container}>
          <div className={commonStyles.content}>
            <div className={styles.posts}>
              {posts.map(post => (
                <div key={post.uid} className={styles.post}>
                  <h2 className={styles.title}>
                    <Link href={`/post/${post.uid}`}>
                      <a>{post.data.title}</a>
                    </Link>
                  </h2>
                  <p>{post.data.subtitle}</p>
                  <div className={commonStyles.information}>
                    <span>
                      <FiCalendar className={commonStyles.icon} />
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM yyyy',
                        { locale: ptBR }
                      )}
                    </span>
                    <span>
                      <FiUser className={commonStyles.icon} />
                      {post.data.author}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.pagination}>
              {postsPagination.next_page && (
                <button type="button" onClick={fetchPosts}>
                  Carregar mais posts
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: [
        'posts.title',
        'posts.subtitle',
        'posts.author',
        'posts.uid',
        'posts.first_publication_date',
      ],
      pageSize: 1,
    }
  );
  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };
  return {
    props: {
      postsPagination,
    },
  };
};
