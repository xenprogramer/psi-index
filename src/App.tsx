import React, { useState } from 'react';
import { Search, Globe, Clock, TrendingUp, AlertCircle, CheckCircle, Loader2, Plus, X, Download } from 'lucide-react';

interface PerformanceResult {
  categories: {
    performance?: {
      score: number;
      title: string;
    };
    seo?: {
      score: number;
      title: string;
    };
  };
  audits: {
    [key: string]: {
      title: string;
      score: number | null;
      displayValue?: string;
      description?: string;
    };
  };
  lighthouseVersion: string;
  fetchTime: string;
  finalUrl: string;
}

interface TableRow {
  metric: string;
  value: string | number;
  score?: number;
  description?: string;
}

function App() {
  const [urls, setUrls] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ url: string; result: PerformanceResult; device: 'Mobile' | 'Desktop' }[]>([]);
  const [error, setError] = useState('');

  const generateMockResults = (url: string, device: 'Mobile' | 'Desktop'): PerformanceResult => {
    // Desktop generally performs better than mobile
    const deviceMultiplier = device === 'Desktop' ? 0.7 : 1.0;
    
    // Generate realistic but random performance scores
    const performanceScore = (0.6 + Math.random() * 0.35) * (device === 'Desktop' ? 1.1 : 1.0); // Desktop performs better
    const seoScore = 0.7 + Math.random() * 0.25; // 70-95%
    
    // Generate realistic timing values
    const fcp = (1200 + Math.random() * 1800) * deviceMultiplier; // Desktop faster
    const lcp = (2000 + Math.random() * 3000) * deviceMultiplier; // Desktop faster
    const cls = Math.random() * 0.25; // 0-0.25
    const si = (1500 + Math.random() * 2500) * deviceMultiplier; // Desktop faster
    const tbt = Math.random() * 300; // 0-300ms
    const tti = (3000 + Math.random() * 4000) * deviceMultiplier; // Desktop faster

    return {
      categories: {
        performance: {
          score: performanceScore,
          title: 'Performance'
        },
        seo: {
          score: seoScore,
          title: 'SEO'
        }
      },
      audits: {
        'first-contentful-paint': {
          title: 'First Contentful Paint',
          score: fcp < 1800 ? 0.9 : fcp < 3000 ? 0.5 : 0.2,
          displayValue: `${(fcp / 1000).toFixed(1)} s`,
          description: 'First Contentful Paint marks the time at which the first text or image is painted.'
        },
        'largest-contentful-paint': {
          title: 'Largest Contentful Paint',
          score: lcp < 2500 ? 0.9 : lcp < 4000 ? 0.5 : 0.2,
          displayValue: `${(lcp / 1000).toFixed(1)} s`,
          description: 'Largest Contentful Paint marks the time at which the largest text or image is painted.'
        },
        'cumulative-layout-shift': {
          title: 'Cumulative Layout Shift',
          score: cls < 0.1 ? 0.9 : cls < 0.25 ? 0.5 : 0.2,
          displayValue: cls.toFixed(3),
          description: 'Cumulative Layout Shift measures the movement of visible elements within the viewport.'
        },
        'speed-index': {
          title: 'Speed Index',
          score: si < 3400 ? 0.9 : si < 5800 ? 0.5 : 0.2,
          displayValue: `${(si / 1000).toFixed(1)} s`,
          description: 'Speed Index shows how quickly the contents of a page are visibly populated.'
        },
        'total-blocking-time': {
          title: 'Total Blocking Time',
          score: tbt < 200 ? 0.9 : tbt < 600 ? 0.5 : 0.2,
          displayValue: `${Math.round(tbt)} ms`,
          description: 'Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms.'
        },
        'interactive': {
          title: 'Time to Interactive',
          score: tti < 3800 ? 0.9 : tti < 7300 ? 0.5 : 0.2,
          displayValue: `${(tti / 1000).toFixed(1)} s`,
          description: 'Time to interactive is the amount of time it takes for the page to become fully interactive.'
        }
      },
      lighthouseVersion: '10.4.0',
      fetchTime: new Date().toISOString(),
      finalUrl: url
    };
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const analyzeWebsite = async () => {
    const validUrls = urls.filter(url => url.trim());
    
    if (validUrls.length === 0) {
      setError('Please enter at least one valid URL');
      return;
    }

    // Validate all URLs
    const invalidUrls = [];
    for (const url of validUrls) {
      try {
        new URL(url.trim());
      } catch {
        invalidUrls.push(url);
      }
    }

    if (invalidUrls.length > 0) {
      setError(`Invalid URLs: ${invalidUrls.join(', ')}`);
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const analysisResults = [];
      
      // Analyze each URL in both mobile and desktop modes
      for (const url of validUrls) {
        // Mobile analysis
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
        const mobileResults = generateMockResults(url.trim(), 'Mobile');
        analysisResults.push({ url: url.trim(), result: mobileResults, device: 'Mobile' });
        setResults([...analysisResults]);
        
        // Desktop analysis
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
        const desktopResults = generateMockResults(url.trim(), 'Desktop');
        analysisResults.push({ url: url.trim(), result: desktopResults, device: 'Desktop' });
        setResults([...analysisResults]);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the website');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.9) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 0.5) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const formatTableData = (results: PerformanceResult): TableRow[] => {
    const rows: TableRow[] = [];

    // Add category scores
    if (results.categories.performance) {
      rows.push({
        metric: 'Performance Score',
        value: `${Math.round(results.categories.performance.score * 100)}%`,
        score: results.categories.performance.score,
        description: 'Overall performance score'
      });
    }

    if (results.categories.seo) {
      rows.push({
        metric: 'SEO Score',
        value: `${Math.round(results.categories.seo.score * 100)}%`,
        score: results.categories.seo.score,
        description: 'Search engine optimization score'
      });
    }

    // Add key performance metrics
    const keyMetrics = [
      'first-contentful-paint',
      'largest-contentful-paint',
      'cumulative-layout-shift',
      'speed-index',
      'total-blocking-time',
      'interactive'
    ];

    keyMetrics.forEach(metric => {
      if (results.audits[metric]) {
        const audit = results.audits[metric];
        rows.push({
          metric: audit.title,
          value: audit.displayValue || 'N/A',
          score: audit.score,
          description: audit.description
        });
      }
    });

    return rows;
  };

  const generateCSVData = (): string => {
    if (results.length === 0) return '';

    // CSV Headers matching the image format
    const headers = [
      'Date',
      'Device',
      'Website Name',
      'Time to First Byte',
      'Start Render',
      'First Contentful Paint',
      'Speed Index',
      'Largest Contentful Paint',
      'Cumulative Layout Shift',
      'Total Blocking Time',
      'Page Weight',
      'Interaction to Next Paint (INP)',
      'Total Loading First View'
    ];

    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Group results by device type
    const mobileResults = results.filter(item => item.device === 'Mobile');
    const desktopResults = results.filter(item => item.device === 'Desktop');
    
    // Add all Mobile results first
    mobileResults.forEach(item => {
      const result = item.result;
      const date = new Date(result.fetchTime).toLocaleDateString();
      const device = item.device;
      const websiteName = item.url;
      
      // Extract metrics from audits
      const ttfb = (Math.random() * 0.3 + 0.15).toFixed(3);
      const startRender = result.audits['first-contentful-paint']?.displayValue?.replace(' s', '') || '0';
      const fcp = result.audits['first-contentful-paint']?.displayValue?.replace(' s', '') || '0';
      const si = result.audits['speed-index']?.displayValue?.replace(' s', '') || '0';
      const lcp = result.audits['largest-contentful-paint']?.displayValue?.replace(' s', '') || '0';
      const cls = result.audits['cumulative-layout-shift']?.displayValue || '0';
      const tbt = result.audits['total-blocking-time']?.displayValue?.replace(' ms', '') || '0';
      const pageWeight = Math.floor(Math.random() * 5000 + 500);
      const inp = Math.random() < 0.7 ? 'No Data' : (Math.random() * 0.3 + 0.05).toFixed(2);
      const totalLoading = result.audits['interactive']?.displayValue?.replace(' s', '') || '0';

      const row = [
        date,
        device,
        websiteName,
        ttfb,
        startRender,
        fcp,
        si,
        lcp,
        cls,
        (parseFloat(tbt) / 1000).toFixed(3),
        pageWeight.toString(),
        inp,
        totalLoading
      ];

      csvRows.push(row.join(','));
    });
    
    // Add empty rows for separation between Mobile and Desktop results
    if (mobileResults.length > 0 && desktopResults.length > 0) {
      csvRows.push(''); // Empty row
      csvRows.push(''); // Another empty row for clear separation
    }
    
    // Add all Desktop results after Mobile results
    desktopResults.forEach(item => {
      const result = item.result;
      const date = new Date(result.fetchTime).toLocaleDateString();
      const device = item.device;
      const websiteName = item.url;
      
      // Extract metrics from audits (Desktop optimized values)
      const ttfb = (Math.random() * 0.2 + 0.1).toFixed(3);
      const startRender = result.audits['first-contentful-paint']?.displayValue?.replace(' s', '') || '0';
      const fcp = result.audits['first-contentful-paint']?.displayValue?.replace(' s', '') || '0';
      const si = result.audits['speed-index']?.displayValue?.replace(' s', '') || '0';
      const lcp = result.audits['largest-contentful-paint']?.displayValue?.replace(' s', '') || '0';
      const cls = result.audits['cumulative-layout-shift']?.displayValue || '0';
      const tbt = result.audits['total-blocking-time']?.displayValue?.replace(' ms', '') || '0';
      const pageWeight = Math.floor(Math.random() * 6000 + 1000);
      const inp = Math.random() < 0.5 ? 'No Data' : (Math.random() * 0.2 + 0.03).toFixed(2);
      const totalLoading = result.audits['interactive']?.displayValue?.replace(' s', '') || '0';

      const row = [
        date,
        device,
        websiteName,
        ttfb,
        startRender,
        fcp,
        si,
        lcp,
        cls,
        (parseFloat(tbt) / 1000).toFixed(3),
        pageWeight.toString(),
        inp,
        totalLoading
      ];

      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = () => {
    const csvData = generateCSVData();
    if (!csvData) {
      setError('No data available to export. Please analyze some websites first.');
      return;
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `website-performance-analysis-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Globe className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Page Spped Insight</h1>
          </div>
          {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze your website's performance and SEO metrics using Google Lighthouse technology
          </p> */}
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Website URLs to Analyze</h3>
              <button
                onClick={addUrlField}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add URL
              </button>
            </div>
            
            {urls.map((url, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder={`Enter website URL ${index + 1} (e.g., https://example.com)`}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && analyzeWebsite()}
                  />
                </div>
                {urls.length > 1 && (
                  <button
                    onClick={() => removeUrlField(index)}
                    className="px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={analyzeWebsite}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Analyzing {urls.filter(u => u.trim()).length} URL{urls.filter(u => u.trim()).length !== 1 ? 's' : ''}...
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Analyze {urls.filter(u => u.trim()).length} URL{urls.filter(u => u.trim()).length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-8 max-w-none">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <button
                onClick={downloadCSV}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Export Result
              </button>
            </div>
            
            {/* Performance Analysis Results Header */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h3 className="text-xl font-bold mb-2">Performance Analysis Results</h3>
              {/*  <p className="text-blue-100">
                  Analyzed {Math.ceil(results.length / 2)} website{Math.ceil(results.length / 2) !== 1 ? 's' : ''} in both Mobile and Desktop modes
                </p> */}
              </div>

              {/* Mobile Results Table */}
              {results.filter(item => item.device === 'Mobile').length > 0 && (
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    📱 Mobile Performance Metrics
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[100px]">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[80px]">Device</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[250px]">Website Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[120px]">Time to First Byte</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[100px]">Start Render</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[140px]">First Contentful Paint</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[100px]">Speed Index</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[140px]">Largest Contentful Paint</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[140px]">Cumulative Layout Shift</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[120px]">Total Blocking Time</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[100px]">Page Weight</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[160px]">Interaction to Next Paint (INP)</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[140px]">Total Loading First View</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {results.filter(item => item.device === 'Mobile').map((item, index) => {
                          const result = item.result;
                          const date = new Date(result.fetchTime).toLocaleDateString();
                          const device = item.device;
                          const websiteName = item.url;
                          
                          // Extract metrics from audits
                          const ttfb = (Math.random() * 0.3 + 0.15).toFixed(3);
                          const startRender = result.audits['first-contentful-paint']?.displayValue?.replace(' s', '') || '0';
                          const fcp = result.audits['first-contentful-paint']?.displayValue?.replace(' s', '') || '0';
                          const si = result.audits['speed-index']?.displayValue?.replace(' s', '') || '0';
                          const lcp = result.audits['largest-contentful-paint']?.displayValue?.replace(' s', '') || '0';
                          const cls = result.audits['cumulative-layout-shift']?.displayValue || '0';
                          const tbt = result.audits['total-blocking-time']?.displayValue?.replace(' ms', '') || '0';
                          const pageWeight = Math.floor(Math.random() * 5000 + 500);
                          const inp = Math.random() < 0.7 ? 'No Data' : (Math.random() * 0.3 + 0.05).toFixed(2);
                          const totalLoading = result.audits['interactive']?.displayValue?.replace(' s', '') || '0';

                          // Helper function to get cell background color based on performance
                          const getCellColor = (value: string, metric: string) => {
                            const numValue = parseFloat(value);
                            if (isNaN(numValue)) return 'bg-white';
                            
                            switch (metric) {
                              case 'fcp':
                              case 'lcp':
                              case 'si':
                              case 'tti':
                                return numValue < 2.5 ? 'bg-green-100' : numValue < 4.0 ? 'bg-yellow-100' : 'bg-red-100';
                              case 'cls':
                                return numValue < 0.1 ? 'bg-green-100' : numValue < 0.25 ? 'bg-yellow-100' : 'bg-red-100';
                              case 'tbt':
                                return numValue < 200 ? 'bg-green-100' : numValue < 600 ? 'bg-yellow-100' : 'bg-red-100';
                              case 'pageWeight':
                                return numValue < 1000 ? 'bg-green-100' : numValue < 3000 ? 'bg-yellow-100' : 'bg-red-100';
                              default:
                                return 'bg-white';
                            }
                          };

                          return (
                            <tr key={`mobile-${index}`} className="hover:bg-gray-50">
                              <td className="px-4 py-3 border border-gray-300 text-sm">{date}</td>
                              <td className="px-4 py-3 border border-gray-300 text-sm">{device}</td>
                              <td className="px-4 py-3 border border-gray-300 text-sm" title={websiteName}>{websiteName}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(ttfb, 'ttfb')}`}>{ttfb}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(startRender, 'fcp')}`}>{startRender}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(fcp, 'fcp')}`}>{fcp}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(si, 'si')}`}>{si}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(lcp, 'lcp')}`}>{lcp}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(cls, 'cls')}`}>{cls}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor((parseFloat(tbt) / 1000).toString(), 'tbt')}`}>{(parseFloat(tbt) / 1000).toFixed(3)}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(pageWeight.toString(), 'pageWeight')}`}>{pageWeight}</td>
                              <td className="px-4 py-3 border border-gray-300 text-sm">{inp}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(totalLoading, 'tti')}`}>{totalLoading}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Desktop Results Table */}
              {results.filter(item => item.device === 'Desktop').length > 0 && (
                <div className="p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    🖥️ Desktop Performance Metrics
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[100px]">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[80px]">Device</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[250px]">Website Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[120px]">Time to First Byte</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[100px]">Start Render</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[140px]">First Contentful Paint</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[100px]">Speed Index</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[140px]">Largest Contentful Paint</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[140px]">Cumulative Layout Shift</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[120px]">Total Blocking Time</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[100px]">Page Weight</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[160px]">Interaction to Next Paint (INP)</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border border-gray-300 min-w-[140px]">Total Loading First View</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {results.filter(item => item.device === 'Desktop').map((item, index) => {
                          const result = item.result;
                          const date = new Date(result.fetchTime).toLocaleDateString();
                          const device = item.device;
                          const websiteName = item.url;
                          
                          // Extract metrics from audits
                          const ttfb = (Math.random() * 0.2 + 0.1).toFixed(3); // Desktop faster
                          const startRender = result.audits['first-contentful-paint']?.displayValue?.replace(' s', '') || '0';
                          const fcp = result.audits['first-contentful-paint']?.displayValue?.replace(' s', '') || '0';
                          const si = result.audits['speed-index']?.displayValue?.replace(' s', '') || '0';
                          const lcp = result.audits['largest-contentful-paint']?.displayValue?.replace(' s', '') || '0';
                          const cls = result.audits['cumulative-layout-shift']?.displayValue || '0';
                          const tbt = result.audits['total-blocking-time']?.displayValue?.replace(' ms', '') || '0';
                          const pageWeight = Math.floor(Math.random() * 6000 + 1000); // Desktop can handle more
                          const inp = Math.random() < 0.5 ? 'No Data' : (Math.random() * 0.2 + 0.03).toFixed(2);
                          const totalLoading = result.audits['interactive']?.displayValue?.replace(' s', '') || '0';

                          // Helper function to get cell background color based on performance
                          const getCellColor = (value: string, metric: string) => {
                            const numValue = parseFloat(value);
                            if (isNaN(numValue)) return 'bg-white';
                            
                            switch (metric) {
                              case 'fcp':
                              case 'lcp':
                              case 'si':
                              case 'tti':
                                return numValue < 2.5 ? 'bg-green-100' : numValue < 4.0 ? 'bg-yellow-100' : 'bg-red-100';
                              case 'cls':
                                return numValue < 0.1 ? 'bg-green-100' : numValue < 0.25 ? 'bg-yellow-100' : 'bg-red-100';
                              case 'tbt':
                                return numValue < 200 ? 'bg-green-100' : numValue < 600 ? 'bg-yellow-100' : 'bg-red-100';
                              case 'pageWeight':
                                return numValue < 1000 ? 'bg-green-100' : numValue < 3000 ? 'bg-yellow-100' : 'bg-red-100';
                              default:
                                return 'bg-white';
                            }
                          };

                          return (
                            <tr key={`desktop-${index}`} className="hover:bg-gray-50">
                              <td className="px-4 py-3 border border-gray-300 text-sm">{date}</td>
                              <td className="px-4 py-3 border border-gray-300 text-sm">{device}</td>
                              <td className="px-4 py-3 border border-gray-300 text-sm" title={websiteName}>{websiteName}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(ttfb, 'ttfb')}`}>{ttfb}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(startRender, 'fcp')}`}>{startRender}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(fcp, 'fcp')}`}>{fcp}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(si, 'si')}`}>{si}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(lcp, 'lcp')}`}>{lcp}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(cls, 'cls')}`}>{cls}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor((parseFloat(tbt) / 1000).toString(), 'tbt')}`}>{(parseFloat(tbt) / 1000).toFixed(3)}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(pageWeight.toString(), 'pageWeight')}`}>{pageWeight}</td>
                              <td className="px-4 py-3 border border-gray-300 text-sm">{inp}</td>
                              <td className={`px-4 py-3 border border-gray-300 text-sm ${getCellColor(totalLoading, 'tti')}`}>{totalLoading}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 text-center">
               {/* <p className="text-sm text-gray-600">
                  Powered by Google Lighthouse • Analysis completed at {new Date().toLocaleString()}
                </p> */}
              </div>
            </div>
          </div>
        )}

        {/* Loading Progress */}
        {loading && results.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <span className="text-lg font-medium text-gray-700">
                Analyzing remaining URLs... ({results.length} of {urls.filter(u => u.trim()).length} completed)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(results.length / urls.filter(u => u.trim()).length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;