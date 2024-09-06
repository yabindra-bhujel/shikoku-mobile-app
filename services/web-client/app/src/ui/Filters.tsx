import React from 'react';

interface FiltersProps {
  filters: any;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDepartmentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, onDepartmentChange, onPerPageChange }) => (
  <section className="bg-white shadow-md rounded-lg p-2 mb-2 border border-gray-200">
    <p className="text-sm text-gray-700 mb-2">フィルター</p>
    <div className="flex justify-between items-center flex-wrap gap-2">
      {/* Checkbox Filters */}
      {Object.keys(filters).map(key => key !== 'department' && (
        <label key={key} className="flex items-center">
          <input
            type="checkbox"
            name={key}
            checked={filters[key]}
            onChange={onFilterChange}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700 text-sm">{key}</span>
        </label>
      ))}

      {/* Department Dropdown */}
      <div className="flex items-center">
        <label className="text-gray-700 mr-2 text-sm">学科別:</label>
        <select
          value={filters.department}
          onChange={onDepartmentChange}
          className="w-full sm:w-48 p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">選択してください</option>
          <option value="media">コンピュータサイエンス</option>
          <option value="management">経営学</option>
          <option value="internatianl">国際関係</option>
          <option value="language">言語学</option>
        </select>
      </div>

      {/* Per Page Dropdown */}
      <div className="flex items-center">
        <label className="text-gray-700 mr-2 text-sm">表示件数:</label>
        <select
          value={filters.perPage}
          onChange={onPerPageChange}
          className="w-full sm:w-48 p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  </section>
);

export default Filters;
