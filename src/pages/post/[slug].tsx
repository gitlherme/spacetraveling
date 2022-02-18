import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Spacetraveling</title>
      </Head>
      <main className={commonStyles.main}>
        <img
          src={post.data.banner.url}
          alt={post.data.banner.alt}
          className={styles.banner}
        />
        <div className={commonStyles.container}>
          <div className={commonStyles.content}>
            <div className={styles.post}>
              <h1 className={styles.title}>{post.data.title}</h1>
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
                <span>
                  <FiClock className={commonStyles.icon} />4 min
                </span>
              </div>
              <div className={styles.content}>
                {post.data.content.map(({ heading, body }) => (
                  <div key={heading}>
                    <h2>{heading}</h2>
                    {body.map(({ text }) => (
                      <p key={text}>{text}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
        alt: response.data.banner.alt,
      },
      author: response.data.author,
      content: response.data.content.map(item => {
        return {
          heading: item.heading,
          body: item.body.map(body => {
            return {
              text: body.text,
            };
          }),
        };
      }),
    },
    uid: response.uid,
  };
  return {
    props: {
      post,
    },
    redirect: 60 * 30,
  };
};
