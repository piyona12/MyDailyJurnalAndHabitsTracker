let currentDateStr = new Date().toISOString().split('T')[0];

const presetOptions = [
  { title: "🛏️ Merapikan tempat tidur", category: "Rumah & Diri" },
  { title: "🧹 Membersihkan kamar", category: "Rumah & Diri" },
  { title: "🧹 Menyapu rumah", category: "Rumah & Diri" },
  { title: "🧴 Mandi dan merawat diri", category: "Kesehatan" },
  { title: "📖 Membaca buku", category: "Produktivitas" },
  { title: "💡 Belajar hal baru", category: "Produktivitas" },
  { title: "✏️ Mengerjakan tugas", category: "Kuliah" },
  { title: "🏃‍♀️ Berolahraga ringan", category: "Kesehatan" },
  { title: "🤝 Membantu orang tua", category: "Keluarga" },
  { title: "🍳 Memasak makanan sederhana", category: "Rumah & Diri" },
  { title: "💰 Menabung", category: "Keuangan" },
  { title: "📦 Merapikan barang-barang", category: "Rumah & Diri" },
  { title: "🪴 Menyiram tanaman", category: "Rumah & Diri" },
  { title: "🕌 Beribadah dan berdoa", category: "Ibadah" },
  { title: "📅 Membuat jadwal kegiatan besok", category: "Produktivitas" },
  { title: "😴 Tidur tepat waktu", category: "Kesehatan" }
];

const universalMotivations = [
  "Wah, kamu hebat banget sudah menyelesaikan kegiatannya! ✨",
  "Terima kasih sudah rajin mengisi jurnal hari ini! Kamu keren sekali! 🌟",
  "Satu langkah lagi menuju diri yang lebih konsisten dan hebat! 🚀",
  "Usahamu hari ini sangat patut diapresiasi! Tetap semangat ya! 💪",
  "Keren banget! Setiap kebiasaan kecil membuat harimu makin bermakna! 🔥"
];

const islamicMotivations = [
  "MasyaAllah Tabarakallah! Semoga menjadi keberkahan untukmu! 🌸",
  "Alhamdulillah! Ibadah & kebiasaan baikmu hari ini terlaksana dengan lancar! ✨",
  "Semoga istiqomah selalu dan dipermudah setiap urusanmu! 🤲",
  "Luar biasa! Semoga Allah membalas setiap kebaikan kecilmu hari ini! 💖"
];

let appData = {
  habits: [
    { id: '1', title: '🛏️ Merapikan tempat tidur', category: 'Rumah & Diri', xp: 20, done: false },
    { id: '2', title: '📖 Membaca buku', category: 'Produktivitas', xp: 20, done: false },
    { id: '3', title: '✏️ Mengerjakan tugas', category: 'Kuliah', xp: 20, done: false },
    { id: '4', title: '💰 Menabung', category: 'Keuangan', xp: 20, done: false }
  ],
  finances: [
    { id: 'f1', date: currentDateStr, type: 'income', desc: 'Uang Saku', amount: 150000 },
    { id: 'f2', date: currentDateStr, type: 'expense', desc: 'Makan & Es Kopi', amount: 22000 }
  ]
};

// Mode Edit Control
let editingHabitIndex = null;

// DOM Elements
const modeSelect = document.getElementById('modeSelect');
const datePicker = document.getElementById('currentDate');
const finDateInput = document.getElementById('finDate');
const habitTableBody = document.getElementById('habitTableBody');
const financeTableBody = document.getElementById('financeTableBody');
const financeForm = document.getElementById('financeForm');

const plantAvatar = document.getElementById('plantAvatar');
const plantStageName = document.getElementById('plantStageName');
const plantDialogue = document.getElementById('plantDialogue');
const xpBarFill = document.getElementById('xpBarFill');
const xpText = document.getElementById('xpText');
const waterPlantBtn = document.getElementById('waterPlantBtn');

const totalIncomeVal = document.getElementById('totalIncomeVal');
const totalExpenseVal = document.getElementById('totalExpenseVal');
const netBalanceVal = document.getElementById('netBalanceVal');

const alertModal = document.getElementById('alertModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const presetModal = document.getElementById('presetModal');
const presetListContainer = document.getElementById('presetListContainer');

// Elements Custom Modal Input
const customInputModal = document.getElementById('customInputModal');
const customHabitInput = document.getElementById('customHabitInput');
const cancelCustomModalBtn = document.getElementById('cancelCustomModalBtn');
const saveCustomModalBtn = document.getElementById('saveCustomModalBtn');

datePicker.value = currentDateStr;
finDateInput.value = currentDateStr;

function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatRp(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

function renderHabits() {
  habitTableBody.innerHTML = '';
  let totalXP = appData.habits.length * 20;
  let currentXP = 0;

  appData.habits.forEach((habit, idx) => {
    if (habit.done) currentXP += habit.xp || 20;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <input type="checkbox" class="habit-checkbox" ${habit.done ? 'checked' : ''} onchange="toggleHabit(${idx})">
      </td>
      <td>
        <strong style="${habit.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${habit.title}</strong>
      </td>
      <td><span class="badge-cat">${habit.category}</span></td>
      <td style="text-align: center;">
        <button class="btn-icon-btn" onclick="openEditHabitModal(${idx})" title="Edit">✏️</button>
        <button class="btn-icon-btn" onclick="deleteHabit(${idx})" title="Hapus">🗑️</button>
      </td>
    `;
    habitTableBody.appendChild(tr);
  });

  updatePlantStatus(currentXP, totalXP || 100);
}

window.toggleHabit = function(index) {
  const habit = appData.habits[index];
  habit.done = !habit.done;

  if (habit.done) {
    const isIslamicMode = modeSelect.value === 'islami';
    const isIslamicTask = habit.title.toLowerCase().includes('sholat') || 
                          habit.title.toLowerCase().includes('ibadah') || 
                          habit.title.toLowerCase().includes('doa') || 
                          habit.title.toLowerCase().includes('tilawah');

    let randomMsg, title, btnText, icon;

    if (isIslamicMode || isIslamicTask) {
      randomMsg = islamicMotivations[Math.floor(Math.random() * islamicMotivations.length)];
      title = "MasyaAllah!";
      btnText = "Alhamdulillah, Lanjutkan! 🌸";
      icon = "✨";
    } else {
      randomMsg = universalMotivations[Math.floor(Math.random() * universalMotivations.length)];
      title = "Wah, Kamu Keren Banget! 🎉";
      btnText = "Terima Kasih, Lanjutkan! 🚀";
      icon = "👏";
    }

    showAlert(title, `${randomMsg}\n\nKegiatan "${habit.title}" berhasil diselesaikan! Tanamanmu dapat poin XP!`, icon, btnText);
  }

  renderHabits();
};

// Modal Handling untuk "+ Buat Sendiri" & "Edit"
document.getElementById('addCustomBtn').addEventListener('click', () => {
  editingHabitIndex = null;
  customHabitInput.value = '';
  customInputModal.classList.add('active');
});

window.openEditHabitModal = function(index) {
  editingHabitIndex = index;
  customHabitInput.value = appData.habits[index].title;
  customInputModal.classList.add('active');
};

cancelCustomModalBtn.addEventListener('click', () => {
  customInputModal.classList.remove('active');
});

saveCustomModalBtn.addEventListener('click', () => {
  const val = customHabitInput.value.trim();
  if (val !== '') {
    if (editingHabitIndex !== null) {
      appData.habits[editingHabitIndex].title = val;
    } else {
      appData.habits.push({
        id: Date.now().toString(),
        title: val,
        category: 'Custom',
        xp: 20,
        done: false
      });
    }
    renderHabits();
    customInputModal.classList.remove('active');
  }
});

window.deleteHabit = function(index) {
  appData.habits.splice(index, 1);
  renderHabits();
};

function updatePlantStatus(currentXP, maxXP) {
  let percent = maxXP > 0 ? Math.round((currentXP / maxXP) * 100) : 0;
  xpBarFill.style.width = `${percent}%`;
  xpText.innerText = `Progress Tumbuhan: ${currentXP} / ${maxXP} XP (${percent}%)`;

  if (percent === 0) {
    plantAvatar.innerText = '🌰';
    plantStageName.innerText = 'Benih Biji';
    plantDialogue.innerText = '"Bismillah / Semangat! Yuk mulai hari ini dengan kegiatan bermanfaat!"';
  } else if (percent < 40) {
    plantAvatar.innerText = '🌱';
    plantStageName.innerText = 'Kecambah Segar';
    plantDialogue.innerText = '"Wah, aku mulai tumbuh! Teruskan habit positifmu ya!"';
  } else if (percent < 80) {
    plantAvatar.innerText = '🌿';
    plantStageName.innerText = 'Tumbuhan Rindang';
    plantDialogue.innerText = '"Sedikit lagi aku akan berbunga mekar berkat usahamu!"';
  } else {
    plantAvatar.innerText = '🌸';
    plantStageName.innerText = 'Bunga Mekar Sempurna';
    plantDialogue.innerText = '"Luar biasa! Hari ini kamu sangat produktif dan hebat!"';
  }
}

function renderFinances() {
  financeTableBody.innerHTML = '';
  let income = 0;
  let expense = 0;

  appData.finances.forEach((item, idx) => {
    if (item.type === 'income') income += item.amount;
    else expense += item.amount;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size: 11px; color:#664d53;">${formatDateIndo(item.date)}</td>
      <td>${item.type === 'income' ? '🟢 Masuk' : '🔴 Pengeluaran'}</td>
      <td>${item.desc}</td>
      <td style="font-weight:700;">${formatRp(item.amount)}</td>
      <td><button class="btn-icon-btn" onclick="deleteFinance(${idx})">🗑️</button></td>
    `;
    financeTableBody.appendChild(tr);
  });

  totalIncomeVal.innerText = formatRp(income);
  totalExpenseVal.innerText = formatRp(expense);
  netBalanceVal.innerText = formatRp(income - expense);
}

financeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const date = document.getElementById('finDate').value;
  const type = document.getElementById('finType').value;
  const desc = document.getElementById('finDesc').value.trim();
  const amount = parseFloat(document.getElementById('finAmount').value);

  if (desc && amount > 0) {
    appData.finances.unshift({ id: Date.now().toString(), date, type, desc, amount });
    document.getElementById('finDesc').value = '';
    document.getElementById('finAmount').value = '';
    renderFinances();
  }
});

window.deleteFinance = function(index) {
  appData.finances.splice(index, 1);
  renderFinances();
};

// Preset Modal
document.getElementById('addPresetBtn').addEventListener('click', () => {
  presetListContainer.innerHTML = '';
  presetOptions.forEach(opt => {
    const card = document.createElement('div');
    card.className = 'preset-item-card';
    card.innerHTML = `${opt.title} <br><span style="font-size:10px; color:#664d53;">${opt.category}</span>`;
    card.onclick = () => {
      appData.habits.push({
        id: Date.now().toString(),
        title: opt.title,
        category: opt.category,
        xp: 20,
        done: false
      });
      renderHabits();
      presetModal.classList.remove('active');
    };
    presetListContainer.appendChild(card);
  });
  presetModal.classList.add('active');
});

document.getElementById('closePresetModalBtn').addEventListener('click', () => {
  presetModal.classList.remove('active');
});

function showAlert(title, message, icon = '🎉', buttonText = 'Terima Kasih, Lanjutkan! ➔') {
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalMessage').innerText = message;
  document.getElementById('modalIcon').innerText = icon;
  closeModalBtn.innerText = buttonText;
  alertModal.classList.add('active');
}

closeModalBtn.addEventListener('click', () => {
  alertModal.classList.remove('active');
});

waterPlantBtn.addEventListener('click', () => {
  const allDone = appData.habits.length > 0 && appData.habits.every(h => h.done);
  if (allDone) {
    showAlert('🌸 LUAR BIASA PERFECT!', 'Seluruh kegiatan hari ini berhasil kamu selesaikan! Tanamanmu mekar sempurna!', '🌺', 'Terima Kasih, Lanjutkan! 🚀');
  } else {
    showAlert('💧 Siram Tanaman', 'Tanaman disiram! Selesaikan lebih banyak kegiatan agar tanaman mekar sempurna!', '🌱', 'Semangat, Lanjutkan! 🚀');
  }
});

// Initial Render
renderHabits();
renderFinances();