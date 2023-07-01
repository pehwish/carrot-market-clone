import Layout from '@components/layout';
import { readdirSync, readFileSync } from 'fs';
import matter from 'gray-matter';
import { NextPage } from 'next';
import Link from 'next/link';

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title='Blog' seoTitle='Blog'>
      <h1 className='font-semibold text-center text-xl mt-5 mb-10'>
        Latest Posts:
      </h1>
      {posts.map((post, index) => (
        <div key={index} className='mb-5'>
          <Link href={`/blog/${post.slug}`}>
            <span className='text-lg text-red-500'>{post.title}</span>
            <div>
              <span>
                {post.date} / {post.category}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

/**
 * 
getStaticProps
getStaticProps는 항상 서버에서 실행되고 클라이언트에서는 실행되지 않습니다. getStaticProps는 정적 HTML을 생성하므로 들어오는 request(예: 쿼리 매개변수 또는 HTTP 헤더)에 액세스할 수 없습니다. getStaticProps가 있는 페이지가 빌드 시 미리 렌더링되면 페이지 HTML 파일 외에도 Next.js가 getStaticProps 실행 결과를 포함하는 JSON 파일을 생성합니다.
https://nextjs.org/docs/basic-features/data-fetching/get-static-props

readdireSync()
디렉토리(폴더)의 내용을 읽습니다.
https://nodejs.org/api/fs.html#fsreaddirsyncpath-options

readFileSync()
path의 내용을 반환합니다.
https://nodejs.org/api/fs.html#fsreadfilesyncpath-options

gray-matter
문자열 또는 파일에서 front-matter을 파싱합니다.
npm i gray-matter
https://github.com/jonschlinkert/gray-matter
https://www.npmjs.com/package/gray-matter
 */

export async function getStaticProps() {
  const blogPosts = readdirSync('./posts').map(file => {
    const content = readFileSync(`./posts/${file}`, 'utf-8');
    const [slug, _] = file.split('.');
    return { ...matter(content).data, slug };
  });
  return {
    props: {
      posts: blogPosts.reverse()
    }
  };
}

export default Blog;
