import { useState } from 'react';

const PropertyTableSearch = ({ onSubmit }: any) => {
  const [searchText, setSearchText] = useState('');
  const handleValue = (event: any) => {
    setSearchText(event.target.value);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    onSubmit(searchText);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label
        htmlFor="default-search"
        className="mb-4 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative">
        <input
          type="search"
          id="default-search"
          className="block w-full h-[20px] p-4 pl-5 text-sm text-gray-900 rounded-[25px] border-[2px] focus:outline-none focus:border-blue-900"
          onChange={(e) => handleValue(e)}
          placeholder="검색어를 입력하세요"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-5 flex items-center pl-5"
        >
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default PropertyTableSearch;
