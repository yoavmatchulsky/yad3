export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-gray-600 font-medium">מחפש דירות ביד2...</p>
      <p className="text-gray-400 text-sm mt-1">עשוי לקחת עד 30 שניות</p>
    </div>
  );
}
