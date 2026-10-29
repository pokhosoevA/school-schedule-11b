(() => {
  const names = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
  const shortNames = ["Пн","Вт","Ср","Чт","Пт","Сб"];
  const list = document.querySelector("#lesson-list");
  const count = document.querySelector("#lesson-count");
  const title = document.querySelector("#day-title");
  const date = document.querySelector("#date");
  let selectedDay = 0;
  let demoCancelled = new Set();
  let light = false;

  const now = new Date();
  date.textContent = new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",year:"numeric"}).format(now);

  function render() {
    title.textContent = names[selectedDay];
    document.querySelectorAll(".day").forEach(btn => {
      const active = Number(btn.dataset.day) === selectedDay;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    const lessons = (window.SCHEDULE?.[selectedDay] || []).slice().sort((a,b)=>a.number-b.number);
    count.textContent = `${lessons.length} ${lessons.length===1?"урок":lessons.length>=2&&lessons.length<=4?"урока":"уроков"}`;
    list.replaceChildren();
    if (!lessons.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      const strong = document.createElement("strong");
      strong.textContent = "Расписание пока не добавлено";
      const text = document.createElement("span");
      text.textContent = "Заполни файл schedule.js точными данными из школьной таблицы, и уроки появятся здесь.";
      empty.append(strong,text); list.append(empty); return;
    }
    lessons.forEach(lesson => {
      const key = `${selectedDay}-${lesson.number}`;
      const cancelled = demoCancelled.has(key);
      const card = document.createElement("article");
      card.className = "lesson" + (cancelled ? " cancelled" : "");
      const num = document.createElement("div"); num.className="num"; num.textContent=lesson.number;
      const info = document.createElement("div");
      const subject = document.createElement("div"); subject.className="subject"; subject.textContent=lesson.subject;
      const meta = document.createElement("div"); meta.className="meta"; meta.textContent=lesson.room ? `Кабинет ${lesson.room}` : "Кабинет не указан";
      info.append(subject,meta);
      if(cancelled){const status=document.createElement("div");status.className="status";status.textContent="Отменён · демонстрация";info.append(status);}
      const time = document.createElement("div"); time.className="time";
      time.textContent = lesson.start && lesson.end ? `${lesson.start}–${lesson.end}` : "";
      card.append(num,info,time);list.append(card);
    });
  }
  document.querySelector("#days").addEventListener("click", e => {
    const btn=e.target.closest("button[data-day]"); if(!btn)return;
    selectedDay=Number(btn.dataset.day); render();
  });
  document.querySelector("#cancel-btn").addEventListener("click",()=>{
    const first=(window.SCHEDULE?.[selectedDay]||[]).slice().sort((a,b)=>a.number-b.number)[0];
    if(!first){alert("Сначала добавь уроки в schedule.js.");return;}
    const key=`${selectedDay}-${first.number}`;
    if(demoCancelled.has(key))demoCancelled.delete(key);else demoCancelled.add(key);
    render();
  });
  document.querySelector("#theme-btn").addEventListener("click",()=>{
    light=!light;
    const root=document.documentElement;
    if(light){
      root.style.setProperty("--bg","#f3f6fc");root.style.setProperty("--panel","#ffffff");root.style.setProperty("--card","#ffffff");root.style.setProperty("--line","#dce3ef");root.style.setProperty("--text","#172033");root.style.setProperty("--muted","#63708a");root.style.setProperty("--accent","#2d62c8");root.style.setProperty("--accent-bg","#dbe8ff");
      document.body.style.background="linear-gradient(180deg,#eaf0fb,#f7f9fd 55%)";
      document.querySelector("#theme-btn").textContent="🌙 Тёмная тема";
    } else {
      root.style.setProperty("--bg","#0b1020");root.style.setProperty("--panel","#131b2e");root.style.setProperty("--card","#19243a");root.style.setProperty("--line","#2a3650");root.style.setProperty("--text","#f4f7ff");root.style.setProperty("--muted","#9eabc4");root.style.setProperty("--accent","#8bb5ff");root.style.setProperty("--accent-bg","#20385f");
      document.body.style.background="radial-gradient(ellipse at top,#172342 0%,var(--bg) 52%)";
      document.querySelector("#theme-btn").textContent="☀️ Светлая тема";
    }
  });
  render();
})();