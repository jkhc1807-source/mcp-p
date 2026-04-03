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
        // Swipe left -> Next (Loop)
        const nextIdx = (currIdx + 1) % tabs.length;
        setActiveTab(tabs[nextIdx]);
      } else {
        // Swipe right -> Previous (Loop)
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
        setHourlyData(fore.list.slice(0, 9).map(item => ({
          label: item.dt_txt.split(' ')[1].substring(0, 5),
          t: Math.round(item.main.temp),
          icon: getWeatherEmoji(item.weather[0].main)
        })));
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
        const months = [
          { label: '1월', t: baseT - 15, icon: '❄️' }, { label: '2월', t: baseT - 12, icon: '❄️' },
          { label: '3월', t: baseT - 5, icon: '🌱' }, { label: '4월', t: baseT, icon: '🌸' },
          { label: '5월', t: baseT + 5, icon: '🌿' }, { label: '6월', t: baseT + 10, icon: '☀️' },
          { label: '7월', t: baseT + 15, icon: '🏖️' }, { label: '8월', t: baseT + 18, icon: '☀️' },
          { label: '9월', t: baseT + 8, icon: '🍂' }, { label: '10월', t: baseT + 2, icon: '🍁' },
          { label: '11월', t: baseT - 6, icon: '🌬️' }, { label: '12월', t: baseT - 12, icon: '❄️' }
        ];
        setMonthlyData(months);
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

    return (
      <div className="weather-trend-wrapper">
        <div className="pc-only-chart">
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="premium-svg">
            {data.map((d, i) => {
              const x = padding + i * spacing - 30;
              const barH = ((d.t - minT + 5) / (range + 10)) * 220;
              const y = 340 - barH;
              return (
                <g key={i} className="bar-group">
                  <defs><linearGradient id={`barGrad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style={{stopColor: d.t > 20 ? '#ec4899' : '#3b82f6', stopOpacity: 0.9}} /><stop offset="100%" style={{stopColor: d.t > 20 ? '#fbcfe8' : '#bfdbfe', stopOpacity: 0.3}} /></linearGradient></defs>
                  <rect x={x} y={y} width="60" height={barH} rx="12" fill={`url(#barGrad-${i})`} className="animate-bar" />
                  <text x={x + 30} y={y - 55} textAnchor="middle" fontSize="28">{d.icon}</text>
                  <text x={x + 30} y={y - 20} textAnchor="middle" fontSize="24" fontWeight="900" fill="var(--text-main)">{d.t}°</text>
                  <text x={x + 30} y={400} textAnchor="middle" fontSize="18" fill="var(--text-muted)" fontWeight="800">{d.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mobile-only-list bento-list-v3">
          {data.map((d, i) => (
            <div key={i} className="bento-list-item">
              <span className="list-label">{d.label}</span>
              <span className="list-icon">{d.icon}</span>
              <span className="list-temp">{d.t}°</span>
              <div className="list-bar-bg">
                <div className="list-bar-fill" style={{ width: `${((d.t - minT + 5) / (range + 10)) * 100}%`, background: d.t > 20 ? 'linear-gradient(90deg, #fbbf24, #ec4899)' : 'linear-gradient(90deg, #bfdbfe, #3b82f6)' }}></div>
              </div>
            </div>
          ))}
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
              <div className="tab-indicator-v3" style={{ transform: `translateX(${activeTab === 'hourly' ? '0' : activeTab === 'weekly' ? '100%' : '200%'})`, backgroundColor: activeTab === 'hourly' ? '#3b82f6' : activeTab === 'weekly' ? '#fbbf24' : '#ec4899' }}></div>
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

      <style>{`
        .weather-premium-container { width: 100%; min-height: 100vh; padding: 100px 2rem 80px; display: flex; flex-direction: column; align-items: center; background: #f8fafc; color: #1e293b; font-family: 'Pretendard', 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        .weather-bg-gradient { position: fixed; top:0; left:0; width:100%; height:100%; background: radial-gradient(circle at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(236,72,153,0.06) 0%, transparent 50%); z-index:-1; }
        
        /* --- Search Section --- */
        .search-section-v3 { width: 100%; max-width: 800px; margin-bottom: 4rem; position: relative; z-index: 1000; padding: 0 10px; }
        .search-capsule { display: flex; align-items: center; padding: 0.6rem 1rem; background: white; border-radius: 100px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.02); transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); width: 100%; box-sizing: border-box; }
        .search-capsule:focus-within { transform: translateY(-4px); box-shadow: 0 30px 60px rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.2); }
        .s-icon-v3 { margin-left: 1rem; color: #cbd5e1; font-size: 1.1rem; flex-shrink: 0; }
        .s-input-v3 { flex: 1; border: none; background: none; padding: 0.8rem 1.2rem; font-size: 1.15rem; font-weight: 700; outline: none; color: #1e293b; width: 100%; min-width: 0; }
        .s-input-v3::placeholder { color: #94a3b8; font-weight: 500; }
        .s-clear-v3 { border: none; background: #f1f5f9; color: #64748b; width: 26px; height: 26px; border-radius: 50%; font-size: 11px; cursor: pointer; margin-right: 0.6rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: 0.2s; }
        .s-clear-v3:hover { background: #e2e8f0; color: #1e293b; }
        .s-geo-v3 { border: none; background: none; font-size: 1.4rem; cursor: pointer; padding: 0.5rem; margin-right: 0.5rem; transition: 0.3s; flex-shrink: 0; opacity: 0.7; }
        .s-geo-v3:hover { opacity: 1; transform: scale(1.1); }
        .s-submit-v3 { background: #3b82f6; color: white; border: none; padding: 0.9rem 2rem; border-radius: 100px; font-weight: 800; cursor: pointer; transition: 0.3s; font-size: 1rem; white-space: nowrap; box-shadow: 0 10px 20px rgba(59,130,246,0.2); flex-shrink: 0; }
        .s-submit-v3:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(59,130,246,0.3); }

        .s-dropdown-v3 { position: absolute; top: 120%; left: 10px; right: 10px; background: white; border-radius: 32px; box-shadow: 0 40px 80px rgba(0,0,0,0.15); overflow: hidden; border: 1px solid rgba(0,0,0,0.04); animation: dropSlide 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
        @keyframes dropSlide { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .s-drop-item-v3 { padding: 1.4rem 2.2rem; border-bottom: 1px solid #f8fafc; cursor: pointer; display: flex; flex-direction: column; transition: 0.2s; }
        .s-drop-item-v3:hover { background: #f1f5f9; padding-left: 2.5rem; }
        .s-drop-item-v3 strong { font-size: 1.1rem; color: #1e293b; margin-bottom: 0.2rem; }
        .s-drop-item-v3 span { font-size: 0.9rem; color: #64748b; font-weight: 500; }
        
        /* --- Hero Grid --- */
        .weather-main-grid { width: 100%; max-width: 1100px; display: grid; grid-template-columns: 1.6fr 1fr; gap: 3rem; margin-bottom: 3.5rem; }
        .weather-card-hero { background: white; border-radius: 56px; padding: 4.5rem; box-shadow: 0 30px 60px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(0,0,0,0.01); }
        .hero-header-v3 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .hero-loc-badge { display: flex; align-items: center; gap: 10px; padding: 0.8rem 1.5rem; background: #f1f5f9; border-radius: 100px; font-weight: 800; font-size: 1.1rem; color: #475569; }
        .dot-v3 { width: 10px; height: 10px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px rgba(16,185,129,0.4); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .hero-date-v3 { font-weight: 600; color: #94a3b8; font-size: 1.1rem; }

        .temp-val-v3 { font-size: 10rem; font-weight: 900; letter-spacing: -6px; line-height: 0.85; display: flex; color: #0f172a; }
        .unit-v3 { font-size: 5rem; color: #3b82f6; margin-left: 0.5rem; font-weight: 300; }
        .desc-v3 { font-size: 3rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; display: block; }
        .minmax-v3 { font-size: 1.1rem; font-weight: 600; color: #64748b; background: #f8fafc; padding: 0.5rem 1.2rem; border-radius: 12px; display: inline-block; }
        .hero-visual-v3 { font-size: 11rem; filter: drop-shadow(0 30px 40px rgba(0,0,0,0.1)); }
        
        .weather-side-stats { display: flex; flex-direction: column; gap: 1.8rem; }
        .stat-card-v3 { background: white; border-radius: 40px; padding: 2.2rem; box-shadow: 0 20px 50px rgba(0,0,0,0.02); flex: 1; transition: 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); border: 1px solid rgba(0,0,0,0.01); }
        .stat-card-v3:hover { transform: translateY(-5px); box-shadow: 0 30px 60px rgba(0,0,0,0.05); }
        .stat-title-v3 { font-size: 0.95rem; font-weight: 700; color: #94a3b8; display: flex; align-items: center; gap: 8px; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-val-v3 { font-size: 2.4rem; font-weight: 900; color: #0f172a; margin-bottom: 0.8rem; letter-spacing: -1px; }
        .stat-val-v3 small { font-size: 1.1rem; font-weight: 600; color: #94a3b8; margin-left: 0.3rem; }
        .stat-msg-v3 { font-size: 1rem; font-weight: 600; color: #64748b; }
        
        .progress-v3 { width: 100%; height: 10px; background: #f1f5f9; border-radius: 10px; overflow: hidden; margin-top: 1rem; }
        .bar-v3 { height: 100%; background: linear-gradient(90deg, #3b82f6, #60a5fa); border-radius: 10px; transition: width 1s ease-out; }

        .weather-chart-section { width: 100%; max-width: 1100px; background: white; border-radius: 56px; padding: 4.5rem; box-shadow: 0 30px 60px rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.01); }
        .chart-header-v3 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; flex-wrap: wrap; gap: 2rem; }
        .chart-label-v3 { font-size: 2rem; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; margin: 0; }
        .chart-tabs-v3 { display: flex; position: relative; background: #f1f5f9; padding: 0.5rem; border-radius: 100px; width: 100%; max-width: 420px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .tab-indicator-v3 { position: absolute; top: 0.5rem; left: 0.5rem; bottom: 0.5rem; width: calc(33.333% - 0.34rem); border-radius: 100px; transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.4s ease; z-index: 1; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .tab-btn-v3 { position: relative; flex: 1; border: none; background: none; padding: 1rem 0.5rem; border-radius: 100px; color: #64748b; font-weight: 800; cursor: pointer; z-index: 2; font-size: 1.05rem; transition: 0.3s; }
        .tab-btn-v3.active { color: white; }
        .tab-btn-v3:not(.active):hover { color: #1e293b; }

        .trend-content-area { width: 100%; min-height: 300px; }
        .pc-only-chart { display: block !important; width: 100%; }
        .mobile-only-list { display: none !important; }
        .premium-svg { width: 100%; height: auto; overflow: visible; }

        .bento-list-v3 { width: 100%; display: flex; flex-direction: column; gap: 1.2rem; }
        .bento-list-item { display: grid; grid-template-columns: 70px 50px 70px 1fr; align-items: center; padding: 1.8rem 2rem; background: #f8fafc; border-radius: 28px; border: 1px solid rgba(0,0,0,0.01); transition: 0.2s; }
        .bento-list-item:hover { transform: scale(1.02); background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        .list-label { font-weight: 800; color: #64748b; font-size: 1.1rem; }
        .list-icon { font-size: 1.6rem; text-align: center; }
        .list-temp { font-weight: 900; color: #0f172a; font-size: 1.3rem; text-align: right; margin-right: 1.5rem; }
        .list-bar-bg { height: 12px; background: #e2e8f0; border-radius: 10px; overflow: hidden; position: relative; }
        .list-bar-fill { height: 100%; border-radius: 10px; transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1); }

        @media (max-width: 1050px) {
          .weather-main-grid { grid-template-columns: 1fr; gap: 2rem; }
          .weather-card-hero { padding: 3.5rem; }
        }

        @media (max-width: 950px) {
          .weather-side-stats { flex-direction: row; flex-wrap: wrap; }
          .stat-card-v3 { min-width: 200px; }
          .weather-premium-container { padding: 110px 2rem 60px; }
        }

        @media (max-width: 768px) {
          .chart-header-v3 { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .chart-label-v3 { font-size: 1.8rem; }
          .chart-tabs-v3 { max-width: 100%; }
        }

        @media (max-width: 650px) {
          .pc-only-chart { display: none !important; }
          .mobile-only-list { display: flex !important; }
          .weather-premium-container { padding: 90px 1.2rem 40px; }
          .search-section-v3 { margin-bottom: 2.5rem; }
          
          .weather-card-hero { padding: 2.5rem 1.8rem; border-radius: 40px; }
          .hero-header-v3 { margin-bottom: 2.5rem; }
          .hero-loc-badge { font-size: 1rem; padding: 0.6rem 1.2rem; }
          
          .temp-val-v3 { font-size: 7rem; letter-spacing: -4px; justify-content: center; }
          .unit-v3 { font-size: 3rem; margin-top: 1rem; }
          .desc-v3 { font-size: 2.2rem; text-align: center; }
          .minmax-v3 { display: block; text-align: center; margin: 0 auto; width: fit-content; }
          .hero-visual-v3 { font-size: 8rem; text-align: center; margin-top: 1rem; }
          
          .weather-side-stats { flex-direction: column; gap: 1.2rem; }
          .stat-card-v3 { padding: 1.8rem; border-radius: 32px; }
          .stat-val-v3 { font-size: 2.1rem; }
          
          .weather-chart-section { padding: 2.5rem 1.5rem; border-radius: 40px; }
          .chart-header-v3 { margin-bottom: 2.5rem; }
          
          .bento-list-item { grid-template-columns: 60px 45px 60px 1fr; padding: 1.4rem 1.2rem; border-radius: 20px; gap: 8px; }
          .list-label { font-size: 1rem; }
          .list-icon { font-size: 1.4rem; }
          .list-temp { font-size: 1.1rem; margin-right: 0.8rem; }
          
          .s-submit-v3 { font-size: 0; padding: 0.8rem; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; }
          .s-submit-v3::before { content: '🔍'; font-size: 1.2rem; }
          .s-input-v3 { padding: 0.8rem 0.6rem; font-size: 1.05rem; }
          .s-icon-v3 { margin-left: 0.5rem; }
        }
      `}</style>
    </Layout>
  );
};

export default Weather;
