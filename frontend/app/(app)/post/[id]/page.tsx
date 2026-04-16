import ClientPost from "./ClientPost";

// This is required for 'output: export'
export function generateStaticParams() {
  // Returning at least one dummy ID or an empty list if your 
  // hosting supports fallback routing to index.html
  return [{ id: '1' }]; 
}

export default function PostPage() {
  return <ClientPost />;
}
