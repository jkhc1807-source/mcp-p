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
        setMonthlyData([{label:'1월',t:baseT-15,icon:'❄️'}, {label:'4월',t:baseT,icon:'🌸'}, {label:'8월',t:baseT+12,icon:'☀️'}, {label:'12월',t:baseT-12,icon:'❄️'}]);
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
        // 카카오 API를 사용하여 좌표를 주소로 변환 (역지오코딩)
        const res = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`, {
          headers: { 'Authorization': `KakaoAK ${KAKAO_KEY}` }
        });
        const data = await res.json();
        const addr = data.documents?.[0]?.address?.address_name || 
                     data.documents?.[0]?.road_address?.address_name || 
                     '현재 위치';
        
        // 변환된 주소 이름으로 날씨 정보 페치
        fetchRealWeather(latitude, longitude, addr);
      } catch (e) {
        console.error('주소 변환 실패:', e);
        fetchRealWeather(latitude, longitude, '현재 위치');
      }
    }, (err) => {
      console.error('위치 정보 획득 실패:', err);
      setIsLoading(false);
      alert('위치 정보를 가져올 수 없습니다. 브라우저의 위치 권한을 확인해주세요.');
    });
  };

  const renderChart = (data, color) => {
    if (!data.length) return null;
    const chartW = 1200, chartH = 350, padding = 80, spacing = (chartW - padding * 2) / (data.length - 1), yScale = 8, yOffset = 250;
    
    // 부드러운 곡선을 위한 경로 생성
    let path = `M ${padding},${yOffset - data[0].t * yScale}`;
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = padding + i * spacing, y1 = yOffset - data[i].t * yScale, x2 = padding + (i + 1) * spacing, y2 = yOffset - data[i + 1].t * yScale;
      const cp1x = x1 + (x2 - x1) / 3, cp2x = x1 + (x2 - x1) * 2 / 3;
      path += ` C ${cp1x},${y1} ${cp2x},${y2} ${x2},${y2}`;
    }

    return (
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="premium-svg">
        <defs>
          <linearGradient id={`fill-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor:color, stopOpacity:0.15}} />
            <stop offset="100%" style={{stopColor:color, stopOpacity:0}} />
          </linearGradient>
          <filter id="soft-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
        </defs>
        
        <path d={`${path} L ${chartW - padding},${chartH} L ${padding},${chartH} Z`} fill={`url(#fill-${color})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" filter="url(#soft-glow)" />
        
        {data.map((d, i) => {
          const x = padding + i * spacing, y = yOffset - d.t * yScale;
          return (
            <g key={i} className="chart-node">
              <text x={x} y={y - 45} textAnchor="middle" fontSize="20" className="node-emoji">{d.icon}</text>
              <text x={x} y={y - 18} textAnchor="middle" fontSize="15" fontWeight="800" fill="#1e293b">{d.t}°</text>
              <circle cx={x} cy={y} r="6" fill="white" stroke={color} strokeWidth="3" />
              <text x={x} y={chartH - 10} textAnchor="middle" fontSize="14" fill="#94a3b8" fontWeight="700">{d.label}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <Layout>
      <div className={`weather-premium-container ${isLoading ? 'is-loading' : ''}`}>
        <div className="weather-bg-gradient"></div>

        {/* --- 검색바: 슬림 글래스 캡슐 --- */}
        <section className="search-section-v3">
          <div className="search-capsule" ref={searchRef}>
            <span className="s-icon-v3">🔍</span>
            <input 
              type="text" placeholder="도시 검색" 
              className="s-input-v3"
              value={cityInput}
              onChange={(e) => { setCityInput(e.target.value); if(e.target.value.length >= 2) searchAddress(e.target.value); }}
              onKeyDown={(e) => e.key === 'Enter' && searchAddress(cityInput)}
            />
            {cityInput && (
              <button className="s-clear-v3" onClick={() => { setCityInput(''); setSearchResults([]); }}>✕</button>
            )}
            <button className="s-geo-v3" onClick={handleGeoLocation}>📍</button>
            <button className="s-submit-v3" onClick={() => searchAddress(cityInput)}>검색</button>

            {isDropdownOpen && searchResults.length > 0 && (
              <div className="s-dropdown-v3">
                {searchResults.map((loc, i) => (
                  <div key={i} className="s-drop-item-v3" onClick={() => { setIsDropdownOpen(false); setCityInput(loc.name); fetchRealWeather(loc.lat, loc.lon, loc.name); }}>
                    <strong>{loc.name}</strong>
                    <span>{loc.sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- 벤토 레이아웃: 정제된 에어리 스타일 --- */}
        <main className="weather-main-grid">
          {/* 히어로 카드 */}
          <section className="weather-card-hero">
            <div className="hero-header-v3">
              <div className="hero-loc-badge">
                <span className="dot-v3"></span>
                {weather.location}
              </div>
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

          {/* 세부 정보 카드 */}
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

        {/* --- 하단 차트: 프로페셔널 데이터 보드 --- */}
        <section className="weather-chart-section">
          <div className="chart-header-v3">
            <h3 className="chart-label-v3">날씨 트렌드</h3>
            <div className="chart-tabs-v3">
              {['hourly', 'weekly', 'monthly'].map(t => (
                <button key={t} className={`tab-btn-v3 ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                  {t === 'hourly' ? '시간별' : t === 'weekly' ? '주간' : '월간'}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-canvas-v3">
            {activeTab === 'hourly' && renderChart(hourlyData, '#3b82f6')}
            {activeTab === 'weekly' && renderChart(weeklyData, '#fbbf24')}
            {activeTab === 'monthly' && renderChart(monthlyData, '#ec4899')}
          </div>
        </section>
      </div>

      <style>{`
        .weather-premium-container { width: 100%; min-height: 100vh; padding: 100px 2rem 80px; display: flex; flex-direction: column; align-items: center; background: #f8fafc; color: #1e293b; }
        .weather-bg-gradient { position: fixed; top:0; left:0; width:100%; height:100%; background: radial-gradient(circle at 80% 20%, rgba(59,130,246,0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(236,72,153,0.05) 0%, transparent 50%); z-index:-1; }

        /* --- Search Capsule --- */
        .search-section-v3 { width: 100%; max-width: 800px; margin-bottom: 4rem; position: relative; z-index: 1000; }
        .search-capsule { 
          display: flex; align-items: center; padding: 0.5rem 1rem; background: white; border-radius: 100px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.03); transition: 0.4s;
        }
        .search-capsule:focus-within { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); border-color: var(--primary); }
        .s-icon-v3 { margin-left: 1rem; color: #94a3b8; }
        .s-input-v3 { flex: 1; border: none; background: none; padding: 0.8rem 1rem; font-size: 1.1rem; font-weight: 600; outline: none; color: #1e293b; }
        .s-clear-v3 { border: none; background: #f1f5f9; color: #94a3b8; width: 24px; height: 24px; border-radius: 50%; font-size: 10px; cursor: pointer; margin-right: 0.5rem; }
        .s-geo-v3 { border: none; background: none; font-size: 1.2rem; cursor: pointer; padding: 0.5rem; margin-right: 0.5rem; transition: 0.2s; }
        .s-geo-v3:hover { transform: scale(1.2); }
        .s-submit-v3 { background: var(--primary); color: white; border: none; padding: 0.7rem 1.8rem; border-radius: 100px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .s-submit-v3:hover { background: #2563eb; }

        .s-dropdown-v3 { position: absolute; top: 120%; left: 0; right: 0; background: white; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid rgba(0,0,0,0.05); }
        .s-drop-item-v3 { padding: 1.2rem 2rem; border-bottom: 1px solid #f8fafc; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; }
        .s-drop-item-v3:hover { background: #f0f7ff; padding-left: 2.5rem; }
        .s-drop-item-v3 strong { font-size: 1.05rem; }
        .s-drop-item-v3 span { font-size: 0.85rem; color: #94a3b8; }

        /* --- Weather Main Grid --- */
        .weather-main-grid { width: 100%; max-width: 1000px; display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .weather-card-hero { background: white; border-radius: 40px; padding: 3.5rem; box-shadow: 0 10px 40px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; }
        .hero-loc-badge { display: flex; align-items: center; gap: 0.6rem; font-weight: 900; color: var(--primary); font-size: 1.1rem; }
        .dot-v3 { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; }
        .hero-date-v3 { color: #94a3b8; font-weight: 700; }
        .hero-header-v3 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        
        .hero-content-v3 { display: flex; justify-content: space-between; align-items: center; }
        .temp-val-v3 { font-size: 8rem; font-weight: 900; letter-spacing: -4px; line-height: 1; display: flex; }
        .unit-v3 { font-size: 3rem; font-weight: 400; color: var(--primary); margin-top: 1rem; }
        .temp-desc-group { margin-left: 2rem; }
        .desc-v3 { display: block; font-size: 2.2rem; font-weight: 900; margin-bottom: 0.5rem; }
        .minmax-v3 { color: #94a3b8; font-weight: 700; font-size: 1.1rem; }
        .hero-visual-v3 { font-size: 9rem; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.05)); }

        /* --- Side Stats --- */
        .weather-side-stats { display: flex; flex-direction: column; gap: 1.5rem; }
        .stat-card-v3 { background: white; border-radius: 28px; padding: 1.8rem; box-shadow: 0 10px 30px rgba(0,0,0,0.02); flex: 1; }
        .stat-title-v3 { font-size: 0.9rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .stat-val-v3 { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; }
        .progress-v3 { height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .bar-v3 { height: 100%; background: var(--primary); border-radius: 10px; }
        .stat-msg-v3 { font-size: 0.9rem; font-weight: 700; color: #64748b; }

        /* --- Chart Section --- */
        .weather-chart-section { width: 100%; max-width: 1000px; background: white; border-radius: 40px; padding: 3rem; box-shadow: 0 10px 40px rgba(0,0,0,0.02); }
        .chart-header-v3 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .chart-label-v3 { font-size: 1.4rem; font-weight: 900; }
        .chart-tabs-v3 { display: flex; gap: 0.5rem; background: #f8fafc; padding: 0.4rem; border-radius: 100px; }
        .tab-btn-v3 { border: none; background: none; padding: 0.6rem 1.5rem; border-radius: 100px; color: #94a3b8; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .tab-btn-v3.active { background: white; color: var(--primary); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .chart-canvas-v3 { width: 100%; overflow-x: auto; padding-bottom: 1rem; }
        .premium-svg { width: 100%; min-width: 800px; height: auto; overflow: visible; }

        @media (max-width: 950px) {
          .weather-main-grid { grid-template-columns: 1fr; }
          .weather-side-stats { flex-direction: row; flex-wrap: wrap; }
          .stat-card-v3 { min-width: 200px; }
          .weather-premium-container { padding: 80px 1.5rem; }
        }
        @media (max-width: 650px) {
          .hero-header-v3 { margin-bottom: 1.5rem; }
          .hero-content-v3 { flex-direction: column; text-align: center; }
          .temp-desc-group { margin: 1.5rem 0; }
          .temp-val-v3 { font-size: 6rem; justify-content: center; }
          .weather-side-stats { flex-direction: column; }
          .stat-card-v3 { min-width: 100%; }
        }
      `}</style>
    </Layout>
  );
};

export default Weather;
