/* ==========================================================
   Gaza Australian Program (GAP) — landing page behaviour
   ========================================================== */
(() => {
  'use strict';

  /* ----------------------------------------------------------
     LINKS — edit here.

     Store URLs are shared by all download buttons on the page.

     social: paste a link next to any network to make its icon
     appear everywhere on the page (header, side rail, hero,
     contact card and footer). Empty ones stay hidden.
     ---------------------------------------------------------- */
  const CONFIG = {
    // Picture beside the hero headline:
    //   1 = 3D phone with orbits
    //   2 = the journey from Gaza to a circle of people, with full motion
    //   3 = the journey from Gaza to Australia on a dotted globe
    //   4 = the calm version of 2: one path of light, very little movement
    // To compare without editing, add ?hero=1 ... ?hero=4 to the page address.
    heroVisual: 4,

    androidUrl: 'https://play.google.com/store/apps/details?id=org.gapconnect.app',
    iosUrl: 'https://apps.apple.com/au/app/gap-connect-by-vtech/id6832804388',
    privacyUrl: 'https://gapconnect.au/privacy/',
    social: {
      facebook: 'https://www.facebook.com/profile.php?id=61566738786138',
      instagram: 'https://www.instagram.com/gazaaustralianprogram/',
      whatsapp: '',
      x: '',
      youtube: '',
      tiktok: '',
      linkedin: '',
      telegram: ''
    }
  };

  const SOCIAL_META = {
    facebook: ['Facebook', 'bi-facebook'],
    instagram: ['Instagram', 'bi-instagram'],
    whatsapp: ['WhatsApp', 'bi-whatsapp'],
    x: ['X', 'bi-twitter-x'],
    youtube: ['YouTube', 'bi-youtube'],
    tiktok: ['TikTok', 'bi-tiktok'],
    linkedin: ['LinkedIn', 'bi-linkedin'],
    telegram: ['Telegram', 'bi-telegram']
  };

  const BOOTSTRAP_LTR = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
  const BOOTSTRAP_RTL = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Hero visual: which idea is shown ---------- */
  const heroEl = $('#top');
  if (heroEl) {
    const asked = new URLSearchParams(window.location.search).get('hero');
    heroEl.dataset.hero = ['1', '2', '3', '4'].includes(asked) ? asked : String(CONFIG.heroVisual);
  }

  /* ---------- Social links, rendered from CONFIG.social ---------- */
  function icon(cls) {
    const i = document.createElement('i');
    i.className = 'bi ' + cls;
    i.setAttribute('aria-hidden', 'true');
    return i;
  }

  const socials = Object.keys(CONFIG.social)
    .filter((key) => CONFIG.social[key] && SOCIAL_META[key])
    .map((key) => ({ url: CONFIG.social[key], name: SOCIAL_META[key][0], icon: SOCIAL_META[key][1] }));

  $$('[data-social]').forEach((box) => {
    const big = box.dataset.social === 'big';
    box.textContent = '';
    socials.forEach((s) => {
      const a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.appendChild(icon(s.icon));
      if (big) {
        const label = document.createElement('span');
        label.textContent = s.name;
        a.appendChild(label);
        a.appendChild(icon('bi-arrow-up-right flip-rtl'));
      } else {
        a.setAttribute('aria-label', s.name);
      }
      box.appendChild(a);
    });
  });

  /* ----------------------------------------------------------
     Arabic copy. English lives in index.html.
     ---------------------------------------------------------- */
  const AR = {
    'skip': 'تخطَّ إلى المحتوى',

    'nav.about': 'عن البرنامج',
    'nav.services': 'ماذا نقدّم',
    'nav.grace': 'مبادرة GRACE',
    'nav.app': 'التطبيق',
    'nav.help': 'كيف تساعد',
    'nav.contact': 'تواصل معنا',
    'nav.donate': 'تبرّع الآن',

    'social.follow': 'تابعنا',
    'social.title': 'تابع GAP على وسائل التواصل',
    'social.text': 'أخبار وفعاليات مجتمعية وقصص من العائلات التي ندعمها.',

    'hero.eyebrow': 'مساعدة منسّقة تراعي الثقافة',
    'hero.title': 'ندعم العائلات القادمة إلى أستراليا <span class="grad">من غزة</span>',
    'hero.lead': 'يتواصل برنامج غزة الأسترالي (GAP) مباشرةً مع القادمين الجدد من غزة، فيلبّي احتياجاتهم العاجلة ويستجيب لهمومهم بأسلوب داعم يراعي ثقافتهم.',
    'hero.from': 'غزة',
    'hero.to': 'أستراليا',
    'hero.s1': 'قادم جديد من غزة تلقّوا الدعم',
    'hero.s2': 'خدمات دعم',
    'hero.s3': 'ركائز لمبادرة GRACE',

    'store.getOn': 'حمّله من',
    'store.downloadOn': 'حمّله من',

    'tick.1': 'الترجمة',
    'tick.2': 'الإحالة',
    'tick.3': 'الاستشارات القانونية',
    'tick.4': 'المناصرة',
    'tick.5': 'التبرعات',
    'tick.6': 'رعاية تراعي الصدمات',
    'tick.7': 'السكن',
    'tick.8': 'المجتمع',

    'about.stat': 'قادم جديد من غزة تلقّوا الدعم في بداية استقرارهم',
    'about.eyebrow': 'عن البرنامج',
    'about.title': 'من هو <span class="grad">GAP</span>',
    'about.p1': 'أسّسه مهنيون غزّيون وأستراليون بنوا علاقات مثمرة مع شبكة واسعة من الجهات والشركاء، ويتميّز GAP بقدرته على تنفيذ برامج وفعاليات تعزّز قدرات المجتمعات المتنوعة والمهمَّشة.',
    'about.p2': 'وإدراكاً للأهمية البالغة لدعم القادمين الجدد إلى أستراليا، يتعاون GAP مع المؤسسات الخيرية والحكومية لضمان تقديم الخدمات بسلاسة، ويوفّر دعماً شاملاً للعائلات الغزّية في انتقالها إلى حياتها الجديدة.',
    'about.whyTitle': 'لماذا نفعل ما نفعله',
    'about.why': 'بتمكين أهل غزة بنزاهة خلال هذه المرحلة الانتقالية الصعبة، لا يدعم GAP العائلات فحسب، بل يُثري المجتمع الأوسع أيضاً. تعزّز هذه المبادرة فهماً وتقديراً أعمق للتعددية الثقافية، وترسّخ الشمول وتقوّي نسيجنا الاجتماعي، سعياً إلى أستراليا أكثر انسجاماً وتنوعاً، تُقدَّر فيها كل الثقافات وتندمج في المشهد الثقافي العام.',

    'services.eyebrow': 'خدماتنا',
    'services.title': 'ماذا <span class="grad">نقدّم</span>',
    'services.lead': 'نساعد في تنسيق الخدمات المناسبة مع المؤسسات الشريكة، ونواصل تقديم المساعدة بحسب الحاجة.',
    'services.cta': 'تواصل معنا للمزيد',
    'services.s1.t': 'الترجمة',
    'services.s1.d': 'التواصل مفتاح بناء حياة جديدة في أستراليا. صُمّمت خدمات الترجمة لدينا لتجاوز حواجز اللغة أمام اللاجئين الغزّيين، وضمان وصولك إلى الخدمات والمعلومات الأساسية باللغة التي تفضّلها. من ترجمة الوثائق القانونية إلى المحادثات اليومية، نقدّم مساعدة مهنية تجعل انتقالك أكثر سلاسة.',
    'services.s2.t': 'الإحالة إلى خدمات الدعم',
    'services.s2.d': 'يربط GAP اللاجئين بشبكة من خدمات الدعم المصمَّمة لتلبية احتياجاتهم الخاصة. من الخدمات الصحية والتعليم إلى المساعدة في التوظيف والبرامج المجتمعية، نضمن وصول كل عائلة إلى الموارد اللازمة لانتقال ناجح إلى الحياة في أستراليا.',
    'services.s3.t': 'الاستشارات القانونية وشؤون الهجرة',
    'services.s3.d': 'قد يكون التعامل مع تعقيدات قانون الهجرة مرهقاً. يقدّم GAP استشارات قانونية وفي شؤون الهجرة لمساعدة اللاجئين على فهم حقوقهم وواجباتهم في أستراليا. ويقدّم فريقنا من الخبراء القانونيين الإرشاد في طلبات التأشيرات ولمّ شمل الأسرة وغيرها من المسائل القانونية الأساسية.',
    'services.s4.t': 'التواصل مع الحكومة وأعضاء البرلمان',
    'services.s4.d': 'في GAP نناصر قضايا اللاجئين عبر علاقات متينة مع أعضاء البرلمان والمسؤولين المحليين. تضمن خدمات التواصل لدينا إيصال صوت اللاجئين الغزّيين، ونعمل بجدّ لتمثيل همومهم وتأمين الدعم الحكومي للمبادرات الأساسية.',
    'services.s5.t': 'إدارة التبرعات العينية والخدمية',
    'services.s5.d': 'يقوم عملنا على المساهمات السخية من الأفراد والشركات. عبر التبرعات بالسلع والخدمات، يساعد GAP العائلات المحتاجة بتوفير الملابس والأثاث وسائر المستلزمات الأساسية. ونرحّب أيضاً بالخدمات المهنية كالمساعدة القانونية والرعاية الطبية، لضمان نهج شامل في دعم اللاجئين.',
    'services.s6.t': 'رعاية تراعي الصدمات النفسية',
    'services.s6.d': 'في GAP نقدّم رعاية تراعي أثر الصدمات، مصمَّمة لتجارب الفارّين من النزاع في غزة. ندرك أثر الصدمات النفسية العميقة، ونحرص على أن تكون كل خدمة نقدّمها مراعية للثقافة وداعمة للسلامة النفسية. سواء كنت تعاني من أحداث الماضي أو تتأقلم مع الحياة في أستراليا، نحن هنا لنساعدك على بناء أساس متين للتعافي.',
    'services.s7.t': 'دعم السكن وتنسيق تجهيزه',
    'services.s7.d': 'إيجاد مكان آمن ومستقر للعيش من أولى الخطوات نحو بناء حياة جديدة. يقدّم GAP دعم السكن وتنسيق تجهيزه لمساعدة العائلات القادمة حديثاً في تأمين سكن ميسور التكلفة، وإدارة الخدمات والمرافق، وتأثيث منازلها بالمستلزمات الأساسية. ونعمل عن قرب مع شركائنا في المجتمع كي لا تُترك أي عائلة دون الدعم الذي تحتاجه.',

    'grace.eyebrow': 'مبادرة مميّزة',
    'grace.a1': 'غزة',
    'grace.a2': 'إغاثة',
    'grace.a3': 'إسكان',
    'grace.a4': 'مجتمع',
    'grace.a5': 'تمكين',
    'grace.acronym': 'الإغاثة والإسكان وتمكين المجتمع لأهل غزة',
    'grace.slogan': 'ندعم العائلات. نبني المستقبل.',
    'grace.pathway': 'طريق نحو الاستقلال والنزاهة والكرامة.',
    'grace.pillars': 'ركائزنا الثلاث',
    'grace.p1.t': 'دعم الإيجار',
    'grace.p1.d': 'نساعد العائلات في الحفاظ على <strong>سكن آمن</strong> بتخفيف ضغط الإيجار ومنع تراكم المتأخرات عبر <strong>مساعدة جزئية بحسب الحاجة</strong>.',
    'grace.p2.t': 'دعم المشاريع',
    'grace.p2.d': 'نمكّن الأفراد أصحاب <strong>الأفكار والمهارات والإمكانات</strong> من تطوير مشاريع صغيرة وفرص <strong>دخل مستدام</strong>.',
    'grace.p3.t': 'دعم التوظيف',
    'grace.p3.d': 'نساعد العائلات في الوصول إلى <strong>فرص العمل</strong> وبناء <strong>المهارات</strong> والعودة إلى سوق العمل من أجل <strong>استقرار طويل الأمد</strong>.',
    'grace.statement': 'GRACE أكثر من مجرد مساعدة. إنها طريق نحو <strong>الاستقلال والنزاهة والكرامة</strong>.',
    'grace.v1.t': 'المساءلة',
    'grace.v1.d': 'نتصرّف بمسؤولية.',
    'grace.v2.t': 'الشفافية',
    'grace.v2.d': 'نعمل بوضوح وثقة.',
    'grace.v3.t': 'التمكين',
    'grace.v3.d': 'نبني القدرات والثقة.',
    'grace.v4.t': 'الرحمة',
    'grace.v4.d': 'نخدم بعناية واحترام.',
    'grace.quote': 'لأن كل عائلة تستحق لا الدعم فحسب، بل فرصة <strong>النهوض من جديد بقوة</strong>.',
    'grace.apply': 'ادخل إلى خدمات GRACE عبر التطبيق',

    'app.eyebrow': 'التطبيق الرسمي للبرنامج',
    'app.lead': 'GAP Connect هو المنصة الرسمية لبرنامج غزة الأسترالي (GAP) على الهاتف، ويربط العائلات الغزّية في أستراليا بالدعم والخدمات والبرامج المجتمعية.',
    'app.f1': 'الوصول إلى برامج الدعم والخدمات المجتمعية',
    'app.f2': 'تقديم طلبات المساعدة ومتابعة الحالات',
    'app.f3': 'الوصول إلى خدمات دعم GRACE',
    'app.f4': 'استقبال التحديثات والإشعارات المهمة',
    'app.f5': 'الاطلاع على الفعاليات والأنشطة المجتمعية',
    'app.f6': 'التواصل مع خدمات الدعم والإحالة المناسبة',
    'app.f7': 'المشاركة كمتطوع أو شريك مجتمعي',
    'app.f8': 'دعم GAP عبر التبرعات',
    'chip.1': 'المساعدة في الإيجار',
    'chip.2': 'لقاء مجتمعي',
    'chip.3': 'تابع حالتك',
    'app.download': 'حمّل التطبيق',
    'app.qr': 'امسح الرمز بهاتف أندرويد',
    'app.note': 'بعض الخدمات والمزايا متاحة فقط للمستخدمين المؤهلين أو لأنواع حسابات محددة.',

    'help.eyebrow': 'طرق العطاء',
    'help.title': 'كيف يمكنك <span class="grad">المساعدة</span>',
    'help.donate': 'تبرّع لـ GAP',
    'help.h1.t': 'التبرع بالأدوات المنزلية',
    'help.h1.d': 'ساعد اللاجئين الغزّيين على تأسيس بيت مريح بالتبرع بأدوات منزلية جيدة مثل الأثاث والمفروشات وأدوات المطبخ والأجهزة. كل تبرع جديد أو مستعمل بحالة جيدة يصنع فرقاً.',
    'help.h2.t': 'التبرع بالخدمات',
    'help.h2.d': 'سواء كنت محامياً أو طبيباً أو مترجماً أو صاحب أي مهنة، يمكنك التبرع بخدماتك لتصنع أثراً كبيراً. خبرتك تُحدث فرقاً حقيقياً في حياة اللاجئين.',
    'help.h3.t': 'تبرّع مالياً',
    'help.h3.d': 'تذهب مساهماتك مباشرةً إلى البرامج التي تساعد اللاجئين الغزّيين، ومنها دعم السكن والإرشاد النفسي والاستشارات القانونية. كل دولار يساعدنا على مواصلة تقديم خدمات حيوية.',
    'help.h4.t': 'تطوّع بوقتك',
    'help.h4.d': 'سواء ساعدت في تنظيم الفعاليات المجتمعية أو في الإرشاد أو في الدعم الإداري، فإن وقتك وتفانيك يصنعان فرقاً حقيقياً.',

    'team.eyebrow': 'من يقف خلف GAP',
    'team.title': 'المؤسس <span class="grad">ومجلس الإدارة</span>',
    'team.board': 'مجلس الإدارة',
    'team.director': 'عضو مجلس الإدارة',
    'team.secretary': 'أمين السر',
    'team.m.role': 'المدير والمؤسس',
    'team.m.name': 'محمود كسكين',
    'team.m.bio': 'وُلد محمود كسكين ونشأ في غزة، ويحمل درجة الدكتوراه في الهندسة، وبنى مسيرة مهنية ناجحة في أنحاء الشرق الأوسط. عقب الحرب على غزة عام 2023 عمل بلا كلل لدعم استقرار أكثر من 400 قادم جديد من غزة. أسّس برنامج غزة الأسترالي (GAP)، وأدّى دوراً أساسياً في المناصرة لدى الجهات الحكومية وجمع التبرعات وتوفير السكن وخدمات الدعم الحيوية.',
    'team.f.name': 'فيونا سوليفان',
    'team.f.bio': 'بمسيرة مهنية تنقّلت بين قطاعَي السفر والسينما وتحرير المجلات وجمع التبرعات الخيرية، أدّت فيونا دوراً أساسياً في إطلاق «يالاري»، برنامج المنح الدراسية لأطفال السكان الأصليين.',
    'team.j.name': 'جوانا غودوين',
    'team.j.bio': 'تمتلك جوانا خبرة قيادية واسعة في قطاع الفنون والثقافة غير الربحي، وبنت شراكات راسخة مع مؤسسات دعم اللاجئين.',
    'team.k.name': 'خالد غنام',
    'team.k.bio': 'خالد غنام كاتب وناشط فلسطيني، حاصل على درجة الماجستير في الإدارة الهندسية من جامعة التكنولوجيا في سيدني.',
    'team.y.name': 'يحيى البرعي',
    'team.y.bio': 'يحيى البرعي كاتب ومنتج إعلامي فلسطيني وناشط مجتمعي، وصوت ملتزم بالعدالة والتراث والتمثيل.',

    'contact.eyebrow': 'تواصل معنا',
    'contact.title': 'نحن هنا لنساعدك على بناء <span class="grad">أساس متين.</span>',
    'contact.lead': 'سواء كنت من عائلة وصلت حديثاً، أو متبرعاً، أو متطوعاً، أو مؤسسة شريكة، تواصل معنا وسنوصلك بالدعم المناسب.',

    'footer.ack': 'يُقرّ GAP بالأوصياء التقليديين على الأرض التي نعمل ونعيش ونجتمع عليها. ونعترف بصلتهم المتواصلة بالأرض والماء والمجتمع. ونعرب عن احترامنا لشيوخهم في الماضي والحاضر والمستقبل.',
    'footer.explore': 'استكشف',
    'footer.grace': 'مبادرة GRACE',
    'footer.team': 'فريقنا',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.devBy': 'الموقع والتطبيق من تطوير شركة',
    'footer.rights': 'برنامج غزة الأسترالي (GAP). جميع الحقوق محفوظة.',

    'dock.text': 'مجاناً على Google Play',
    'dock.get': 'حمّل التطبيق',

  };

  const TITLES = {
    en: document.title,
    ar: 'برنامج غزة الأسترالي (GAP) | ندعم العائلات القادمة إلى أستراليا من غزة'
  };

  const DESCRIPTIONS = {
    en: document.querySelector('meta[name="description"]').content,
    ar: '???? ?????? ??? ????????? (GAP) ???????? ??????? ?? ??? ????????? ?? ????????. ????? ??? ??????? ??????? GRACE ????? ????? GAP Connect.'
  };

  /* ---------- Language switch (EN <-> AR, LTR <-> RTL) ---------- */
  const i18nNodes = $$('[data-i18n]');
  const EN = {};
  i18nNodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (!(key in EN)) EN[key] = node.innerHTML;
  });

  // Elements whose label (not their content) is translated, e.g. icon-only buttons.
  const labelNodes = $$('[data-i18n-label]');
  labelNodes.forEach((node) => {
    const key = node.dataset.i18nLabel;
    if (!(key in EN)) EN[key] = node.getAttribute('aria-label');
  });

  const bootstrapCss = $('#bootstrapCss');
  const langLabel = $('#langLabel');

  function setLang(lang) {
    const isAr = lang === 'ar';
    const dict = isAr ? AR : EN;

    i18nNodes.forEach((node) => {
      const value = dict[node.dataset.i18n];
      if (value != null) node.innerHTML = value;
    });

    labelNodes.forEach((node) => {
      const value = dict[node.dataset.i18nLabel];
      if (value == null) return;
      node.setAttribute('aria-label', value);
      if (node.hasAttribute('title')) node.title = value;
    });

    root.lang = isAr ? 'ar' : 'en';
    root.dir = isAr ? 'rtl' : 'ltr';
    document.title = isAr ? TITLES.ar : TITLES.en;
    ['meta[property="og:title"]', 'meta[name="twitter:title"]'].forEach((selector) => {
      const meta = $(selector);
      if (meta) meta.content = document.title;
    });
    ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'].forEach((selector) => {
      const meta = $(selector);
      if (meta) meta.content = DESCRIPTIONS[isAr ? 'ar' : 'en'];
    });
    const locale = $('meta[property="og:locale"]');
    const alternateLocale = $('meta[property="og:locale:alternate"]');
    if (locale) locale.content = isAr ? 'ar' : 'en_AU';
    if (alternateLocale) alternateLocale.content = isAr ? 'en_AU' : 'ar';
    if (bootstrapCss) bootstrapCss.href = isAr ? BOOTSTRAP_RTL : BOOTSTRAP_LTR;
    if (langLabel) langLabel.textContent = isAr ? 'English' : 'العربية';

    document.dispatchEvent(new Event('gap:lang'));
  }

  // The page ALWAYS opens in English. Arabic is shown only after pressing the
  // language button, and the choice is not remembered between visits.
  try { localStorage.removeItem('gap-lang'); } catch (e) { /* private mode */ }

  const langToggle = $('#langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => setLang(root.lang === 'ar' ? 'en' : 'ar'));
  }

  /* ---------- Store + privacy links ---------- */
  $$('[data-store="android"]').forEach((a) => { a.href = CONFIG.androidUrl; });
  $$('[data-link="privacy"]').forEach((a) => { a.href = CONFIG.privacyUrl; });

  // Keep all App Store buttons in sync with CONFIG.iosUrl.
  $$('[data-store="ios"]').forEach((a) => {
    if (!CONFIG.iosUrl) return;
    a.href = CONFIG.iosUrl;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- QR code for the Android link ---------- */
  const qrCard = $('#qrCard');
  const qrCode = $('#qrCode');
  if (qrCard && qrCode && window.QRCode) {
    try {
      new QRCode(qrCode, {
        text: CONFIG.androidUrl,
        width: 224,
        height: 224,
        colorDark: '#0A0A0A',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
      qrCode.removeAttribute('title');
      qrCard.hidden = false;
    } catch (e) { /* leave the QR card hidden */ }
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  revealEls.forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'));
    el.style.setProperty('--d', Math.min(siblings.indexOf(el), 5) * 90 + 'ms');
  });

  const canObserve = 'IntersectionObserver' in window && !reduceMotion;

  function once(elements, options, onEnter) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onEnter(entry.target);
        obs.unobserve(entry.target);
      });
    }, options);
    elements.forEach((el) => observer.observe(el));
  }

  if (canObserve) {
    once(revealEls, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }, (el) => el.classList.add('in'));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Count-up for the stat ---------- */
  function countUp(el) {
    const target = Number(el.dataset.count);
    const duration = 1700;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (canObserve) once($$('[data-count]'), { threshold: 0.6 }, countUp);

  /* ---------- Hero phone: cycle through real app screens ---------- */
  const appScreens = $$('#heroPhone .phone-screen img');
  if (appScreens.length > 1 && !reduceMotion) {
    let current = 0;
    setInterval(() => {
      if (document.hidden) return;
      // The outgoing screen stays solid underneath while the next one fades in over it.
      const previous = appScreens[current];
      previous.classList.replace('is-active', 'is-leaving');
      current = (current + 1) % appScreens.length;
      appScreens[current].classList.add('is-active');
      setTimeout(() => previous.classList.remove('is-leaving'), 900);
    }, 3600);
  }

  /* ---------- Hero phone: tilt toward the pointer ---------- */
  const doorway = $('#heroStage');
  const appPhone = $('#heroPhone');
  if (doorway && appPhone && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    doorway.addEventListener('pointermove', (event) => {
      const box = doorway.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      appPhone.style.setProperty('--ry', (x * 22).toFixed(2) + 'deg');
      appPhone.style.setProperty('--rx', (-y * 14).toFixed(2) + 'deg');
    });
    doorway.addEventListener('pointerleave', () => {
      appPhone.style.setProperty('--ry', '0deg');
      appPhone.style.setProperty('--rx', '0deg');
    });
  }

  /* ---------- Hero circle of people: turns toward the pointer ---------- */
  const heroWelcome = $('#heroWelcome');
  const welcome = heroWelcome && $('.welcome', heroWelcome);
  if (welcome && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroWelcome.addEventListener('pointermove', (event) => {
      const box = heroWelcome.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      welcome.style.setProperty('--rz', (x * 24).toFixed(2) + 'deg');
      welcome.style.setProperty('--rx', (-y * 18).toFixed(2) + 'deg');
    });
    heroWelcome.addEventListener('pointerleave', () => {
      welcome.style.setProperty('--rz', '0deg');
      welcome.style.setProperty('--rx', '0deg');
    });
  }

  /* ---------- Spotlight: light follows the pointer across cards ---------- */
  $$('.spot').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--mx', (event.clientX - box.left).toFixed(1) + 'px');
      card.style.setProperty('--my', (event.clientY - box.top).toFixed(1) + 'px');
    });
  });

  /* ---------- Words light up as the paragraph scrolls through ---------- */
  const scrubEls = $$('[data-scrub]');

  function splitWords() {
    scrubEls.forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'w';
        span.textContent = word;
        el.appendChild(span);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
    scrubWords();
  }

  function scrubWords() {
    const vh = window.innerHeight;
    scrubEls.forEach((el) => {
      const box = el.getBoundingClientRect();
      // 0 when the paragraph enters near the bottom, 1 when it reaches mid-screen
      const progress = reduceMotion ? 1 : Math.min(1, Math.max(0, (vh * 0.88 - box.top) / (box.height + vh * 0.38)));
      const words = el.children;
      const lit = Math.round(progress * words.length);
      for (let i = 0; i < words.length; i += 1) words[i].classList.toggle('on', i < lit);
    });
  }

  if (scrubEls.length) {
    splitWords();
    document.addEventListener('gap:lang', splitWords);
    window.addEventListener('resize', scrubWords, { passive: true });
  }

  /* ---------- Scroll-driven bits ---------- */
  const nav = $('#siteNav');
  const toTop = $('.to-top');
  const dock = $('#dock');
  const progress = $('#progressLine');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = root.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle('is-scrolled', y > 12);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    if (dock) dock.classList.toggle('is-visible', y > 520);
    if (progress) progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (scrubEls.length) scrubWords();
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  /* ---------- Close the mobile menu after choosing a link ---------- */
  const navMenu = $('#navMenu');
  if (navMenu) {
    $$('.nav-link', navMenu).forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('show') && window.bootstrap) {
          bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
        }
      });
    });
  }

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
