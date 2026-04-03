import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from './Layout';
import './Page.css';

const Weather = () => {
  const [cityInput, setCityInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hourly');
  const searchRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [weather, setWeather] = useState({
    temp: 14, condition: 'Clear', location: '서울', humidity: 45, wind: 3.0, description: '맑음'
  });
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const KAKAO_KEY = process.env.REACT_APP_KAKAO_API_KEY || '6beccebbb7a67064b815c5c96aa02869';
  const WEATHER_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'a3f466e7eb029c8529a86e252ea57d45';

  const cityAlias = {
    '하노이': 'Hanoi', '나트랑': 'Nha Trang', '다낭': 'Da Nang', '호치민': 'Ho Chi Minh',
    '방콕': 'Bangkok', '도쿄': 'Tokyo', '오사카': 'Osaka', '후쿠오카': 'Fukuoka',
    '뉴욕': 'New York', '런던': 'London', '파리': 'Paris', '로마': 'Rome'
  };

  useEffect(() => {
    fetchRealWeather(37.5665, 126.9780, '서울');
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const tabs = ['hourly', 'weekly', 'monthly'];
    const currIdx = tabs.indexOf(activeTab);
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        const nextIdx = (currIdx + 1) % tabs.length;
        setActiveTab(tabs[nextIdx]);
      } else {
        const prevIdx = (currIdx - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[prevIdx]);
      }
    }
    touchStartX.current = 0; touchEndX.current = 0;
  };

  const fetchRealWeather = useCallback(async (lat, lon, cityName) => {
    setIsLoading(true);
    try {
      const [currRes, foreRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric&lang=kr`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric&lang=kr`)
      ]);
      const curr = await currRes.json();
      const fore = await foreRes.json();
      if (curr.cod === 200 && fore.cod === "200") {
        setWeather({
          temp: Math.round(curr.main.temp),
          condition: curr.weather[0].main,
          location: cityName,
          humidity: curr.main.humidity,
          wind: curr.wind.speed,
          description: curr.weather[0].description
        });

        // 3시간 데이터를 2시간 단위로 가공 (보간법 적용)
        const rawList = fore.list.slice(0, 12);
        const processedHourly = [];
        const startTime = new Date(rawList[0].dt * 1000);
        
        for (let i = 0; i < 8; i++) {
          const targetTime = new Date(startTime.getTime() + i * 2 * 60 * 60 * 1000);
          const targetTs = targetTime.getTime() / 1000;
          
          // 가장 가까운 두 원본 데이터 찾기
          let left = rawList[0], right = rawList[0];
          for (let j = 0; j < rawList.length - 1; j++) {
            if (rawList[j].dt <= targetTs && rawList[j+1].dt >= targetTs) {
              left = rawList[j];
              right = rawList[j+1];
              break;
            }
          }
          
          // 온도 선형 보간
          let interpTemp;
          let ratio = 0;
          if (left.dt === right.dt) {
            interpTemp = left.main.temp;
          } else {
            ratio = (targetTs - left.dt) / (right.dt - left.dt);
            interpTemp = left.main.temp + (right.main.temp - left.main.temp) * ratio;
          }

          processedHourly.push({
            label: targetTime.getHours().toString().padStart(2, '0') + ':00',
            t: Math.round(interpTemp),
            icon: ratio > 0.5 ? getWeatherEmoji(right.weather[0].main) : getWeatherEmoji(left.weather[0].main)
          });
        }
        setHourlyData(processedHourly);

        const weekly = [];
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        for (let i = 0; i < fore.list.length; i += 8) {
          const item = fore.list[i];
          weekly.push({
            label: days[new Date(item.dt * 1000).getDay()],
            t: Math.round(item.main.temp),
            icon: getWeatherEmoji(item.weather[0].main)
          });
        }
        setWeeklyData(weekly);

        const baseT = Math.round(curr.main.temp);
        setMonthlyData([
          { label: '1월', t: baseT - 15, icon: '❄️' }, { label: '2월', t: baseT - 12, icon: '❄️' },
          { label: '3월', t: baseT - 5, icon: '🌱' }, { label: '4월', t: baseT, icon: '🌸' },
          { label: '5월', t: baseT + 5, icon: '🌿' }, { label: '6월', t: baseT + 10, icon: '☀️' },
          { label: '7월', t: baseT + 15, icon: '🏖️' }, { label: '8월', t: baseT + 18, icon: '☀️' },
          { label: '9월', t: baseT + 8, icon: '🍂' }, { label: '10월', t: baseT + 2, icon: '🍁' },
          { label: '11월', t: baseT - 6, icon: '🌬️' }, { label: '12월', t: baseT - 12, icon: '❄️' }
        ]);
      }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [WEATHER_KEY]);

  const getWeatherEmoji = (c) => ({'Clear':'☀️','Clouds':'☁️','Rain':'🌧️','Snow':'❄️'}[c] || '⛅');

  const searchAddress = useCallback(async (query) => {
    if (!query.trim()) return;
    try {
      setIsLoading(true);
      const translated = cityAlias[query] || query;
      const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(translated)}&limit=10&appid=${WEATHER_KEY}`);
      const geoData = await geoRes.json();
      let res = [];
      if (geoData && geoData.length > 0) {
        res = geoData.map(item => ({ name: `${item.local_names?.ko || item.name} (${item.country})`, sub: `${item.state || ''} ${item.country}`, lat: item.lat, lon: item.lon }));
      }
      if (res.length < 3) {
        const kakaoRes = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`, { headers: { 'Authorization': `KakaoAK ${KAKAO_KEY}` } });
        const kakaoData = await kakaoRes.json();
        const kakaoResList = (kakaoData.documents || []).map(item => ({ name: item.address_name, sub: '대한민국', lat: item.y, lon: item.x }));
        res = [...res, ...kakaoResList];
      }
      setSearchResults(res.slice(0, 10));
      setIsDropdownOpen(true);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }, [KAKAO_KEY, WEATHER_KEY]);

  const handleGeoLocation = () => {
    if (!navigator.geolocation) return;
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`, {
          headers: { 'Authorization': `KakaoAK ${KAKAO_KEY}` }
        });
        const data = await res.json();
        const addr = data.documents?.[0]?.address?.address_name || '현재 위치';
        fetchRealWeather(latitude, longitude, addr);
      } catch (e) { fetchRealWeather(latitude, longitude, '현재 위치'); }
    }, () => { setIsLoading(false); alert('위치 정보를 가져올 수 없습니다.'); });
  };

  const renderTrendChart = (data) => {
    if (!data.length) return null;
    const chartW = 1200, chartH = 450, padding = 80, spacing = (chartW - padding * 2) / (data.length - 1);
    const maxT = Math.max(...data.map(d => d.t), 30), minT = Math.min(...data.map(d => d.t), 0);
    const range = maxT - minT || 10;

    const now = new Date();
    let closestIdx = -1;
    
    if (activeTab === 'hourly') {
      const currentHour = now.getHours();
      let minDiff = Infinity;
      data.forEach((d, idx) => {
        const forecastHour = parseInt(d.label.split(':')[0]);
        let diff = Math.abs(forecastHour - currentHour);
        if (diff > 12) diff = 24 - diff;
        if (diff < minDiff) { minDiff = diff; closestIdx = idx; }
      });
    } else if (activeTab === 'weekly') {
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const today = days[now.getDay()];
      closestIdx = data.findIndex(d => d.label === today);
    } else if (activeTab === 'monthly') {
      const currentMonth = (now.getMonth() + 1) + '월';
      closestIdx = data.findIndex(d => d.label === currentMonth);
    }

    return (
      <div className="weather-trend-wrapper">
        <div className="pc-only-chart">
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="premium-svg">
            {data.map((d, i) => {
              const x = padding + i * spacing - 30;
              const barH = ((d.t - minT + 5) / (range + 10)) * 220;
              const y = 340 - barH;
              const isCurrent = i === closestIdx;
              const themeColor = activeTab === 'hourly' ? '#3b82f6' : activeTab === 'weekly' ? '#10b981' : '#8b5cf6';
              const themeLight = activeTab === 'hourly' ? '#93c5fd' : activeTab === 'weekly' ? '#6ee7b7' : '#c4b5fd';

              const highlightLabel = activeTab === 'hourly' ? '지금' : activeTab === 'weekly' ? '오늘' : '이번 달';

              return (
                <g key={i} className={`bar-group ${isCurrent ? 'is-current' : ''}`}>
                  <defs><linearGradient id={`barGrad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{stopColor: themeColor, stopOpacity: 0.9}} /><stop offset="100%" style={{stopColor: themeLight, stopOpacity: 0.3}} /></linearGradient></defs>
                  <rect x={x} y={y} width="60" height={barH} rx="12" fill={`url(#barGrad-${i})`} className="animate-bar" />
                  {isCurrent && <text x={x + 30} y={y - 85} textAnchor="middle" fontSize="16" fontWeight="900" fill={themeColor} className="now-label">{highlightLabel}</text>}
                  <text x={x + 30} y={y - 55} textAnchor="middle" fontSize="28">{d.icon}</text>
                  <text x={x + 30} y={y - 20} textAnchor="middle" fontSize="24" fontWeight="900" fill="var(--text-main)">{d.t}°</text>
                  <text x={x + 30} y={400} textAnchor="middle" fontSize="18" fill="var(--text-muted)" fontWeight="800">{isCurrent ? highlightLabel : d.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mobile-only-list bento-list-v3">
          {data.map((d, i) => {
            const isCurrent = i === closestIdx;
            const themeGradient = activeTab === 'hourly' ? 'linear-gradient(90deg, #93c5fd, #3b82f6)' : activeTab === 'weekly' ? 'linear-gradient(90deg, #6ee7b7, #10b981)' : 'linear-gradient(90deg, #c4b5fd, #8b5cf6)';
            const highlightLabel = activeTab === 'hourly' ? '지금' : activeTab === 'weekly' ? '오늘' : '이번 달';
            
            return (
              <div key={i} className={`bento-list-item ${isCurrent ? 'is-current' : ''}`}>
                <span className="list-label">{isCurrent ? highlightLabel : d.label}</span>
                <span className="list-icon">{d.icon}</span>
                <span className="list-temp">{d.t}°</span>
                <div className="list-bar-bg">
                  <div className="list-bar-fill" style={{ width: `${((d.t - minT + 5) / (range + 10)) * 100}%`, background: themeGradient }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className={`weather-premium-container ${isLoading ? 'is-loading' : ''}`}>
        <div className="weather-bg-gradient"></div>
        <section className="search-section-v3">
          <div className="search-capsule" ref={searchRef}>
            <span className="s-icon-v3">🔍</span>
            <input type="text" placeholder="도시 검색" className="s-input-v3" value={cityInput} onChange={(e) => { setCityInput(e.target.value); if(e.target.value.length >= 2) searchAddress(e.target.value); }} onKeyDown={(e) => e.key === 'Enter' && searchAddress(cityInput)} />
            {cityInput && <button className="s-clear-v3" onClick={() => { setCityInput(''); setSearchResults([]); }}>✕</button>}
            <button className="s-geo-v3" onClick={handleGeoLocation}>📍</button>
            <button className="s-submit-v3" onClick={() => searchAddress(cityInput)}>검색</button>
            {isDropdownOpen && searchResults.length > 0 && (
              <div className="s-dropdown-v3">{searchResults.map((loc, i) => (<div key={i} className="s-drop-item-v3" onClick={() => { setIsDropdownOpen(false); setCityInput(loc.name); fetchRealWeather(loc.lat, loc.lon, loc.name); }}><strong>{loc.name}</strong><span>{loc.sub}</span></div>))}</div>
            )}
          </div>
        </section>

        <main className="weather-main-grid">
          <section className="weather-card-hero">
            <div className="hero-header-v3">
              <div className="hero-loc-badge"><span className="dot-v3"></span>{weather.location}</div>
              <span className="hero-date-v3">{new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}</span>
            </div>
            <div className="hero-content-v3">
              <div className="hero-temp-group">
                <div className="temp-val-v3">{weather.temp}<span className="unit-v3">°</span></div>
                <div className="temp-desc-group">
                  <span className="desc-v3">{weather.description}</span>
                  <div className="minmax-v3">최고 {weather.temp+2}° / 최저 {weather.temp-3}°</div>
                </div>
              </div>
              <div className="hero-visual-v3">{getWeatherEmoji(weather.condition)}</div>
            </div>
          </section>
          <div className="weather-side-stats">
            <div className="stat-card-v3 humidity">
              <div className="stat-title-v3"><span>💧</span> 습도</div>
              <div className="stat-body-v3">
                <div className="stat-val-v3">{weather.humidity}%</div>
                <div className="progress-v3"><div className="bar-v3" style={{width:`${weather.humidity}%`}}></div></div>
              </div>
            </div>
            <div className="stat-card-v3 wind">
              <div className="stat-title-v3"><span>💨</span> 풍속</div>
              <div className="stat-body-v3">
                <div className="stat-val-v3">{weather.wind} <small>m/s</small></div>
                <div className="stat-msg-v3">{weather.wind > 5 ? '강한 바람' : '약한 바람'}</div>
              </div>
            </div>
            <div className="stat-card-v3 feel">
              <div className="stat-title-v3"><span>🌡️</span> 체감</div>
              <div className="stat-body-v3">
                <div className="stat-val-v3">{weather.temp + 1}°</div>
                <div className="stat-msg-v3">실제보다 따뜻함</div>
              </div>
            </div>
          </div>
        </main>

        <section className="weather-chart-section">
          <div className="chart-header-v3">
            <h3 className="chart-label-v3">날씨 트렌드</h3>
            <div className="chart-tabs-v3">
              <div className="tab-indicator-v3" style={{ transform: `translateX(${activeTab === 'hourly' ? '0' : activeTab === 'weekly' ? '100%' : '200%'})`, backgroundColor: activeTab === 'hourly' ? '#3b82f6' : activeTab === 'weekly' ? '#10b981' : '#8b5cf6' }}></div>
              {['hourly', 'weekly', 'monthly'].map(t => (<button key={t} className={`tab-btn-v3 ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t === 'hourly' ? '시간별' : t === 'weekly' ? '주간' : '월간'}</button>))}
            </div>
          </div>
          <div 
            className="trend-content-area"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            {activeTab === 'hourly' && renderTrendChart(hourlyData)}
            {activeTab === 'weekly' && renderTrendChart(weeklyData)}
            {activeTab === 'monthly' && renderTrendChart(monthlyData)}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Weather;
