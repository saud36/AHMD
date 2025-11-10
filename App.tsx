import React, { useState, useCallback, useEffect } from 'react';
import type { SearchParams, SearchResult, UserLocation } from './types';
import { fetchPlaces } from './services/geminiService';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultsDisplay from './components/ResultsDisplay';

const App: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (geoError) => {
        console.warn("Could not get user location:", geoError.message);
        setError("لم نتمكن من الوصول لموقعك. قد تكون نتائج البحث أقل دقة.");
      }
    );
  }, []);

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setSearchPerformed(true);
    try {
      const data = await fetchPlaces(params, userLocation);
      setResults(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`حدث خطأ أثناء البحث: ${err.message}. يرجى المحاولة مرة أخرى.`);
      } else {
        setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          {error && (
            <div className="mt-6 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
          <ResultsDisplay 
            results={results} 
            isLoading={isLoading} 
            searchPerformed={searchPerformed} 
          />
        </div>
      </main>
    </div>
  );
};

export default App;