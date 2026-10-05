import { useState, useEffect } from 'react';
import { scenes, typographySchedule, colorJourney, checklist, narrativeText } from './data';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [expandedScene, setExpandedScene] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(checklist.length).fill(false));

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'overview', 'narrative', 'scenes', 'typography', 'color', 'checklist'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleCheck = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  const checkedCount = checkedItems.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-cinematic-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-spring-500 flex items-center justify-center">
                <span className="text-xs font-bold text-cinematic-900">ت‌س</span>
              </div>
              <span className="text-sm font-semibold text-gold-400 hidden sm:block">تربیت سالم</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm overflow-x-auto">
              {[
                { id: 'hero', label: 'خانه' },
                { id: 'overview', label: 'مشخصات' },
                { id: 'narrative', label: 'متن روایی' },
                { id: 'scenes', label: 'صحنه‌ها' },
                { id: 'typography', label: 'تایپوگرافی' },
                { id: 'color', label: 'رنگ' },
                { id: 'checklist', label: 'چک‌لیست' },
              ].map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-link px-2 py-1 rounded whitespace-nowrap ${
                    activeSection === item.id ? 'text-gold-400 font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinematic-900 via-cinematic-800 to-cinematic-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-spring-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
              <span className="text-sm text-gray-300">پروژه ویدیوی سینمایی</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">تربیت سالم</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-4 font-light">
              ویدیوی سینمایی الهام‌بخش
            </p>
            <p className="text-base text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
              نسخه مبتنی بر فوتیج استوک — ۶۹ ثانیه — ۱۱ صحنه — مسیر بصری از سختی تا پیروزی
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="glass-card rounded-xl px-5 py-3">
                <div className="text-gold-400 text-2xl font-bold">69s</div>
                <div className="text-xs text-gray-400">مدت هدف</div>
              </div>
              <div className="glass-card rounded-xl px-5 py-3">
                <div className="text-gold-400 text-2xl font-bold">11</div>
                <div className="text-xs text-gray-400">صحنه</div>
              </div>
              <div className="glass-card rounded-xl px-5 py-3">
                <div className="text-gold-400 text-2xl font-bold">16:9</div>
                <div className="text-xs text-gray-400">نسبت تصویر</div>
              </div>
              <div className="glass-card rounded-xl px-5 py-3">
                <div className="text-gold-400 text-2xl font-bold">1080p+</div>
                <div className="text-xs text-gray-400">کیفیت</div>
              </div>
              <div className="glass-card rounded-xl px-5 py-3">
                <div className="text-gold-400 text-2xl font-bold">24/30</div>
                <div className="text-xs text-gray-400">FPS</div>
              </div>
            </div>
            <a href="#overview" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-500 transition-colors">
              <span>مشاهده مشخصات پروژه</span>
              <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="مشخصات اصلی پروژه" subtitle="ویژگی‌های فنی و سبکی" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <SpecCard icon="🎬" title="سبک" value="Cinematic Inspirational / Photorealistic" />
            <SpecCard icon="📐" title="نسبت تصویر" value="16:9 (افقی) — 9:16 (عمودی بعداً)" />
            <SpecCard icon="🎞️" title="خروجی" value="MP4 / H.264 — 1920×1080" />
            <SpecCard icon="🖼️" title="منبع تصویر" value="ویدیوهای استوک رایگان" />
            <SpecCard icon="🎨" title="مسیر رنگ" value="تاریکی → خاکی → طلایی → سبز → پیروزی" />
            <SpecCard icon="🔤" title="فونت" value="Vazirmatn Bold / ExtraBold" />
            <SpecCard icon="🎵" title="صدا" value="بدون موسیقی — نریشن بعداً اضافه می‌شود" />
            <SpecCard icon="🚫" title="ممنوع" value="بدون لوگو، واترمارک، CGI پلاستیکی" />
            <SpecCard icon="✨" title="کیفیت" value="Cinematic — Premium Documentary" />
          </div>

          {/* Visual Identity */}
          <div className="mt-16 glass-card rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gold-400 mb-6">هویت بصری ثابت</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-white mb-3">سبک تصویری</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2"><span className="text-gold-400 mt-1">•</span>Photorealistic cinematic film</li>
                  <li className="flex items-start gap-2"><span className="text-gold-400 mt-1">•</span>Premium documentary quality</li>
                  <li className="flex items-start gap-2"><span className="text-gold-400 mt-1">•</span>محیط‌های طبیعی و واقعی</li>
                  <li className="flex items-start gap-2"><span className="text-gold-400 mt-1">•</span>عمق میدان ظریف، سایه‌های طبیعی</li>
                  <li className="flex items-start gap-2"><span className="text-gold-400 mt-1">•</span>ترکیب‌بندی زیبا و حرکت آرام دوربین</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">حرکت دوربین</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2"><span className="text-spring-400 mt-1">✓</span>Slow push-in</li>
                  <li className="flex items-start gap-2"><span className="text-spring-400 mt-1">✓</span>Slow pull-back</li>
                  <li className="flex items-start gap-2"><span className="text-spring-400 mt-1">✓</span>Gentle tracking</li>
                  <li className="flex items-start gap-2"><span className="text-spring-400 mt-1">✓</span>Subtle crane-up</li>
                  <li className="flex items-start gap-2"><span className="text-spring-400 mt-1">✓</span>Cinematic reveal</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-1">✗</span>لرزش شدید، Zoom ناگهانی، Whip Pan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section id="narrative" className="py-20 px-4 bg-gradient-to-b from-cinematic-900 to-cinematic-800">
        <div className="max-w-4xl mx-auto">
          <SectionTitle title="متن روایی مرجع" subtitle="محتوای تصویری باید مفهوم این متن را دنبال کند" />
          
          <div className="mt-12 glass-card rounded-2xl p-8 relative">
            <div className="absolute top-4 right-4 text-6xl text-gold-400/20 font-serif">«</div>
            <div className="absolute bottom-4 left-4 text-6xl text-gold-400/20 font-serif">»</div>
            <div className="text-gray-200 leading-loose text-base sm:text-lg whitespace-pre-line relative z-10">
              {narrativeText}
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-gold-400 font-bold text-lg mb-2">بیدل دهلوی</p>
              <p className="text-gray-300 italic">
                جرأت پرواز، برقِ خرمنِ آسودگی است / یک جهان آشفتگی در بال و پر داریم ما
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scenes Section */}
      <section id="scenes" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="راهنمای صحنه‌ها" subtitle="۱۱ صحنه — ۶۹ ثانیه — تدوین صحنه‌به‌صحنه" />
          
          {/* Timeline Visual */}
          <div className="mt-12 mb-16 overflow-x-auto">
            <div className="flex items-center min-w-[800px] gap-0">
              {scenes.map((scene, i) => {
                const colors = [
                  'bg-earth-700', 'bg-earth-600', 'bg-gray-600', 'bg-gray-500',
                  'bg-gold-600', 'bg-autumn-500', 'bg-winter-500', 'bg-cinematic-600',
                  'bg-spring-500', 'bg-spring-400', 'bg-gold-400'
                ];
                const widths = ['7%', '7%', '7%', '6%', '7%', '8%', '7%', '6%', '7%', '5%', '2%'];
                return (
                  <div key={scene.id} className="flex items-center">
                    <div
                      className={`${colors[i]} h-12 rounded-sm flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity relative group`}
                      style={{ width: widths[i], minWidth: '40px' }}
                      onClick={() => setExpandedScene(expandedScene === scene.id ? null : scene.id)}
                    >
                      <span className="text-[10px] font-bold text-white/90">{scene.id}</span>
                      <div className="absolute -bottom-8 text-[9px] text-gray-500 whitespace-nowrap">
                        {scene.time.split('–')[0]}
                      </div>
                    </div>
                    {i < scenes.length - 1 && (
                      <div className="w-1 h-0.5 bg-gray-700"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scene Cards */}
          <div className="space-y-4 mt-8">
            {scenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                isExpanded={expandedScene === scene.id}
                onToggle={() => setExpandedScene(expandedScene === scene.id ? null : scene.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section id="typography" className="py-20 px-4 bg-gradient-to-b from-cinematic-800 to-cinematic-900">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="سیستم تایپوگرافی" subtitle="زمان‌بندی متن‌ها و اصول انیمیشن" />
          
          {/* Typography Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gold-400 mb-4">اصول طراحی</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-gold-400">•</span>راست‌چین — حداکثر ۳ تا ۶ کلمه</li>
                <li className="flex items-start gap-2"><span className="text-gold-400">•</span>سفید/کرم برای متن اصلی</li>
                <li className="flex items-start gap-2"><span className="text-gold-400">•</span>طلایی گرم برای کلمات کلیدی</li>
                <li className="flex items-start gap-2"><span className="text-gold-400">•</span>سایه نرم برای خوانایی</li>
                <li className="flex items-start gap-2"><span className="text-gold-400">•</span>Safe Area — بدون Stroke ضخیم</li>
                <li className="flex items-start gap-2"><span className="text-gold-400">•</span>بدون WordArt یا افکت شلوغ</li>
              </ul>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gold-400 mb-4">انیمیشن</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-spring-400">→</span>ورود: opacity 0→100 | 400ms</li>
                <li className="flex items-start gap-2"><span className="text-spring-400">→</span>حرکت Y: 15px → 0</li>
                <li className="flex items-start gap-2"><span className="text-spring-400">→</span>Scale: 97% → 100%</li>
                <li className="flex items-start gap-2"><span className="text-spring-400">→</span>Ease: Ease Out</li>
                <li className="flex items-start gap-2"><span className="text-spring-400">→</span>نمایش: 1.5 تا 2.5 ثانیه</li>
                <li className="flex items-start gap-2"><span className="text-spring-400">→</span>خروج: opacity 100→0 | 350ms</li>
                <li className="flex items-start gap-2"><span className="text-gold-400">★</span>کلمات کلیدی: Scale 96%→102%→100%</li>
              </ul>
            </div>
          </div>

          {/* Typography Preview */}
          <div className="mt-8 glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gold-400 mb-6">پیش‌نمایش متن‌ها</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {typographySchedule.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-cinematic-800/50 rounded-lg px-4 py-3">
                  <span className="text-xs text-gray-500 font-mono min-w-[45px]">{item.time}</span>
                  <span className={`text-sm ${item.bold ? 'font-extrabold text-gold-400' : 'text-gray-200'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Color Journey Section */}
      <section id="color" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="مسیر رنگ" subtitle="از تاریکی و سختی تا نور و پیروزی" />
          
          <div className="mt-12">
            <div className="flex rounded-2xl overflow-hidden h-24 mb-8">
              {colorJourney.map((item, i) => (
                <div
                  key={i}
                  className="flex-1 flex items-center justify-center transition-all hover:flex-[1.5]"
                  style={{ backgroundColor: item.color }}
                >
                  <span className="text-xs sm:text-sm font-bold" style={{ color: item.textColor }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {colorJourney.map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-4 text-center">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 border-2 border-white/10"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <p className="text-sm font-semibold" style={{ color: item.color }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transitions */}
          <div className="mt-16 glass-card rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gold-400 mb-6">طراحی انتقال‌ها</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">بین صحنه‌های مرتبط</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Cross Dissolve کوتاه و نرم</li>
                  <li>• Match Cut بر اساس فرم یا جهت حرکت</li>
                  <li>• برش روی حرکت (Action Cut)</li>
                  <li>• Fade فقط در شروع/پایان</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">بین فصل‌ها و شات‌های کلیدی</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• مسیر → صعود: تطبیق جهت حرکت</li>
                  <li>• صعود → پرنده: برش نرم + صدای باد</li>
                  <li>• خزان → زمستان: Match Cut</li>
                  <li>• زمستان → بهار: انتقال نرم</li>
                  <li>• پایان: Hold + Fade Out به سیاهی</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sound Design Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-cinematic-900 to-cinematic-800">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="طراحی صدا" subtitle="افکت‌های محیطی — زیر نریشن" />
          
          <div className="mt-12 glass-card rounded-2xl p-8">
            <div className="bg-cinematic-900/50 rounded-xl p-4 mb-6 border border-gold-400/20">
              <p className="text-sm text-gold-400 text-center">
                ⚠️ فایل نریشن در مرحله تصویر اضافه نمی‌شود — Timeline آماده برای افزودن صوت
              </p>
            </div>
            
            <div className="space-y-3">
              {[
                { time: "00:00", desc: "آغاز بسیار آرام، بدون ضرب شدید", vol: "—" },
                { time: "00:07", desc: "صدای باد بسیار ظریف", vol: "~15%" },
                { time: "00:14", desc: "Whoosh بسیار نرم — باز شدن بال", vol: "~20%" },
                { time: "00:21", desc: "باد کمی قوی‌تر", vol: "~20%" },
                { time: "00:34", desc: "صدای برگ‌های پاییزی", vol: "~15%" },
                { time: "00:42", desc: "صدای باد و برف بسیار کم", vol: "~10%" },
                { time: "00:55", desc: "صدای باران نرم", vol: "~15%" },
                { time: "01:02", desc: "صدای طبیعت بهاری", vol: "~10%" },
                { time: "01:07", desc: "کاهش تدریجی تمام افکت‌ها", vol: "→ 0%" },
                { time: "01:09", desc: "سکوت", vol: "0%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-cinematic-800/30 rounded-lg px-4 py-3">
                  <span className="text-xs font-mono text-gold-400 min-w-[50px]">{item.time}</span>
                  <span className="text-sm text-gray-300 flex-1">{item.desc}</span>
                  <span className="text-xs text-gray-500 bg-cinematic-700 px-2 py-1 rounded">{item.vol}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stock Sources Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="منابع فوتیج استوک" subtitle="سایت‌های پیشنهادی برای جستجو" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { name: "Pexels", desc: "طبیعت و شات‌های سینمایی", icon: "🌿" },
              { name: "Pixabay", desc: "تنوع در طبیعت و پرندگان", icon: "🦅" },
              { name: "Mixkit", desc: "ویدیوهای سینمایی", icon: "🎬" },
              { name: "Coverr", desc: "شات‌های واید و منظره", icon: "🏔️" },
            ].map((source, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center hover:border-gold-400/30 transition-colors">
                <div className="text-4xl mb-3">{source.icon}</div>
                <h4 className="font-bold text-white mb-1">{source.name}</h4>
                <p className="text-xs text-gray-400">{source.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gold-400 mb-4">بررسی قبل از استفاده</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2"><span className="text-gold-400">•</span>مجوز هر کلیپ را در صفحه دانلود بررسی کنید</li>
              <li className="flex items-start gap-2"><span className="text-gold-400">•</span>محدودیت‌های استفاده تجاری و انتساب را چک کنید</li>
              <li className="flex items-start gap-2"><span className="text-gold-400">•</span>نسخه بدون واترمارک را دانلود کنید</li>
              <li className="flex items-start gap-2"><span className="text-gold-400">•</span>لینک منبع و مجوز را در پوشه پروژه ثبت کنید</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span>از کلیپ‌های دارای برچسب AI پرهیز کنید</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Checklist Section */}
      <section id="checklist" className="py-20 px-4 bg-gradient-to-b from-cinematic-800 to-cinematic-900">
        <div className="max-w-4xl mx-auto">
          <SectionTitle title="چک‌لیست کنترل کیفیت" subtitle={`${checkedCount} از ${checklist.length} مورد تکمیل شده`} />
          
          {/* Progress Bar */}
          <div className="mt-8 mb-8">
            <div className="h-3 bg-cinematic-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-gold-400 to-spring-500 rounded-full transition-all duration-500"
                style={{ width: `${(checkedCount / checklist.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            {checklist.map((item, i) => (
              <label
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                  checkedItems[i]
                    ? 'bg-spring-500/10 border border-spring-500/30'
                    : 'glass-card hover:border-gold-400/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedItems[i]}
                  onChange={() => toggleCheck(i)}
                  className="w-5 h-5 rounded border-2 border-gray-600 accent-spring-500"
                />
                <span className={`text-sm ${checkedItems[i] ? 'text-spring-400 line-through' : 'text-gray-200'}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-spring-500 flex items-center justify-center">
              <span className="text-sm font-bold text-cinematic-900">ت‌س</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-2">پروژه ویدیوی سینمایی «تربیت سالم»</p>
          <p className="text-gray-600 text-xs">
            مستند تولید — نسخه مبتنی بر فوتیج استوک — ۶۹ ثانیه
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-600">
            <span>سنگلاخ → تلاش → پرواز → آشفتگی → اوج → خزان → زمستان → مقاومت → باران → بهار → سعادت</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Components

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h2>
      <p className="text-gray-400 text-sm sm:text-base">{subtitle}</p>
      <div className="w-20 h-1 bg-gradient-to-l from-gold-400 to-spring-500 mx-auto mt-4 rounded-full"></div>
    </div>
  );
}

function SpecCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div className="glass-card rounded-xl p-5 hover:border-gold-400/30 transition-all">
      <div className="text-2xl mb-3">{icon}</div>
      <h4 className="text-sm font-semibold text-gold-400 mb-1">{title}</h4>
      <p className="text-sm text-gray-300">{value}</p>
    </div>
  );
}

function SceneCard({ scene, isExpanded, onToggle }: { scene: any; isExpanded: boolean; onToggle: () => void }) {
  const sceneColors = [
    'from-amber-900/20 to-amber-800/10 border-amber-700/30',
    'from-amber-800/20 to-orange-800/10 border-amber-600/30',
    'from-gray-700/20 to-gray-600/10 border-gray-500/30',
    'from-blue-900/20 to-blue-800/10 border-blue-700/30',
    'from-yellow-800/20 to-amber-700/10 border-yellow-600/30',
    'from-orange-800/20 to-amber-700/10 border-orange-600/30',
    'from-blue-800/20 to-slate-700/10 border-blue-600/30',
    'from-gray-900/20 to-gray-800/10 border-gray-600/30',
    'from-green-800/20 to-emerald-700/10 border-green-600/30',
    'from-green-700/20 to-emerald-600/10 border-green-500/30',
    'from-yellow-700/20 to-amber-600/10 border-yellow-500/30',
  ];

  return (
    <div className={`scene-card rounded-2xl border bg-gradient-to-l ${sceneColors[scene.id - 1]} overflow-hidden`}>
      <div
        className="p-5 cursor-pointer flex items-center gap-4"
        onClick={onToggle}
      >
        <div className="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center flex-shrink-0">
          <span className="text-gold-400 font-bold text-sm">{scene.id}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-bold text-white text-sm sm:text-base">{scene.title}</h3>
            <span className="text-xs text-gray-400 bg-cinematic-800/50 px-2 py-0.5 rounded">{scene.time}</span>
            <span className="text-xs text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded">{scene.duration}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 truncate">{scene.concept}</p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4 animate-fade-in-up">
          {/* Concept */}
          <div>
            <h4 className="text-xs font-semibold text-gold-400 mb-1">مفهوم بصری</h4>
            <p className="text-sm text-gray-300">{scene.concept}</p>
          </div>

          {/* Search Terms */}
          <div>
            <h4 className="text-xs font-semibold text-gold-400 mb-2">عبارت‌های جستجو</h4>
            <div className="flex flex-wrap gap-2">
              {scene.searchTerms.map((term: string, i: number) => (
                <span key={i} className="text-xs bg-cinematic-800/80 text-gray-300 px-3 py-1.5 rounded-lg border border-white/5 font-mono" dir="ltr">
                  {term}
                </span>
              ))}
            </div>
          </div>

          {/* Edit Notes */}
          <div>
            <h4 className="text-xs font-semibold text-gold-400 mb-1">راهنمای برش و تدوین</h4>
            <p className="text-sm text-gray-300">{scene.editNotes}</p>
          </div>

          {/* Typography */}
          <div>
            <h4 className="text-xs font-semibold text-gold-400 mb-2">تایپوگرافی</h4>
            <div className="flex flex-wrap gap-2">
              {scene.typography.map((t: any, i: number) => (
                <div key={i} className="flex items-center gap-2 bg-cinematic-800/50 rounded-lg px-3 py-2">
                  <span className="text-[10px] font-mono text-gray-500">{t.time}</span>
                  <span className="text-sm text-white font-semibold">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sound & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-cinematic-800/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-spring-400 mb-1">🔊 صدا</h4>
              <p className="text-xs text-gray-300">{scene.sound}</p>
            </div>
            <div className="bg-cinematic-800/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-spring-400 mb-1">🎨 اصلاح رنگ</h4>
              <p className="text-xs text-gray-300">{scene.colorGrade}</p>
            </div>
          </div>

          {/* Transition & Sources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-cinematic-800/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-winter-400 mb-1">↔️ انتقال</h4>
              <p className="text-xs text-gray-300">{scene.transition}</p>
            </div>
            <div className="bg-cinematic-800/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-winter-400 mb-1">📁 منابع</h4>
              <ul className="space-y-1">
                {scene.sources.map((s: string, i: number) => (
                  <li key={i} className="text-xs text-gray-300">• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
