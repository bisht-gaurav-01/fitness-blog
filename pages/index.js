export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/blog/the-ultimate-guide",
      permanent: false,
    },
  };
}

export default function HomeRedirect() {
  return null;
}
