import React from 'react';
import { ColorScheme } from '../../types';

interface ColorSchemeSelectorProps {
  value: ColorScheme;
  onChange: (colorScheme: ColorScheme) => void;
}

const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({ value, onChange }) => {
  const colorSchemes: { name: ColorScheme; label: string; colors: string[] }[] = [
    { 
      name: 'purple', 
      label: 'Purple',
      colors: ['bg-purple-200', 'bg-purple-400', 'bg-purple-600']
    },
    { 
      name: 'teal', 
      label: 'Teal',
      colors: ['bg-teal-200', 'bg-teal-400', 'bg-teal-600']
    },
    { 
      name: 'pink', 
      label: 'Pink',
      colors: ['bg-pink-200', 'bg-pink-400', 'bg-pink-600']
    },
    { 
      name: 'amber', 
      label: 'Amber',
      colors: ['bg-amber-200', 'bg-amber-400', 'bg-amber-600']
    },
    { 
      name: 'blue', 
      label: 'Blue',
      colors: ['bg-blue-200', 'bg-blue-400', 'bg-blue-600']
    },
    { 
      name: 'green', 
      label: 'Green',
      colors: ['bg-green-200', 'bg-green-400', 'bg-green-600']
    }
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Color Scheme
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {colorSchemes.map((scheme) => (
          <button
            key={scheme.name}
            type="button"
            className={`flex items-center space-x-2 p-2 rounded-md border-2 transition-all duration-200 ${
              value === scheme.name 
                ? 'border-gray-800 shadow-md' 
                : 'border-gray-200 hover:border-gray-400'
            }`}
            onClick={() => onChange(scheme.name)}
          >
            <div className="flex space-x-1">
              {scheme.colors.map((color, index) => (
                <div key={index} className={`w-4 h-4 rounded-full ${color}`}></div>
              ))}
            </div>
            <span className="text-sm">{scheme.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSchemeSelector;