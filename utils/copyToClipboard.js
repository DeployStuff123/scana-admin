import toast from "react-hot-toast";

export const copyToClipboard = async (slug) => {
  try {
    const fullUrl = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(`https://litz.vercel.app/${slug}`);
    toast.success('Link copied to clipboard');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};