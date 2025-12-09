// components/SectionTitle.js
export default function SectionTitle({ title, linkText, linkHref }) {
  return (
    <div className="flex justify-between items-center my-6 px-4 md:px-10">
      <h2 className="text-2xl font-bold">{title}</h2>
      {linkText && (
        <a
          href={linkHref}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {linkText} →
        </a>
      )}
    </div>
  );
}
