export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 py-2 text-base font-system_medium leading-none text-center text-blue-800 bg-blue-50 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
        loading...
      </div>
    </div>
  );
}
