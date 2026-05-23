export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white px-4 py-6 text-center text-xs text-gray-400 space-y-1">
      <p>
        פרויקט זה הוא ניסיוני בלבד ואינו מיועד לשימוש ציבורי. הנתונים נשלפים
        מיד2 ואינם שייכים לפרויקט זה.
      </p>
      <p>
        נבנה על ידי{" "}
        <a
          href="https://yoavi.codes"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          yoavi.codes
        </a>
      </p>
    </footer>
  );
}
