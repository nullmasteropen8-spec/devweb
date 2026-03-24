/**
 * LottoBall Web Component
 * Encapsulates the look and feel of a lotto ball.
 */
class LottoBall extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['number', 'small'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  getBallColor(num) {
    if (num <= 10) return 'var(--lotto-1)';
    if (num <= 20) return 'var(--lotto-11)';
    if (num <= 30) return 'var(--lotto-21)';
    if (num <= 40) return 'var(--lotto-31)';
    return 'var(--lotto-41)';
  }

  render() {
    const num = parseInt(this.getAttribute('number')) || 0;
    const isSmall = this.hasAttribute('small');
    const size = isSmall ? '32px' : '48px';
    const fontSize = isSmall ? '0.875rem' : '1.25rem';
    const color = this.getBallColor(num);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          perspective: 1000px;
        }
        .ball {
          width: ${size};
          height: ${size};
          background: radial-gradient(circle at 30% 30%, #fff, ${color} 50%, #000 110%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: ${fontSize};
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          box-shadow: 0 4px 10px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(0,0,0,0.3);
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          user-select: none;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0) rotate(-180deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
      </style>
      <div class="ball">${num}</div>
    `;
  }
}

customElements.define('lotto-ball', LottoBall);

/**
 * Lotto Generator Logic
 */
const ballsContainer = document.getElementById('balls-container');
const generateBtn = document.getElementById('generate-btn');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

let history = JSON.parse(localStorage.getItem('lotto-history') || '[]');

function saveHistory(numbers) {
  history.unshift({
    date: new Date().toLocaleString('ko-KR'),
    numbers: numbers
  });
  if (history.length > 10) history.pop();
  localStorage.setItem('lotto-history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  history.forEach((item, index) => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.style.animationDelay = `${index * 0.05}s`;

    const dateSpan = document.createElement('span');
    dateSpan.style.fontSize = '0.75rem';
    dateSpan.style.color = 'var(--secondary-color)';
    dateSpan.style.minWidth = '80px';
    dateSpan.textContent = item.date.split('. ').slice(1).join('.').split(' ').shift();

    const ballsDiv = document.createElement('div');
    ballsDiv.style.display = 'flex';
    ballsDiv.style.gap = '0.4rem';
    
    item.numbers.forEach(num => {
      const ball = document.createElement('lotto-ball');
      ball.setAttribute('number', num);
      ball.setAttribute('small', '');
      ballsDiv.appendChild(ball);
    });

    historyItem.appendChild(dateSpan);
    historyItem.appendChild(ballsDiv);
    historyList.appendChild(historyItem);
  });
}

function generateNumbers() {
  const numbers = [];
  while (numbers.length < 6) {
    const r = Math.floor(Math.random() * 45) + 1;
    if (numbers.indexOf(r) === -1) numbers.push(r);
  }
  return numbers.sort((a, b) => a - b);
}

async function handleGenerate() {
  generateBtn.disabled = true;
  ballsContainer.innerHTML = '';
  
  const numbers = generateNumbers();
  
  for (let i = 0; i < numbers.length; i++) {
    const ball = document.createElement('lotto-ball');
    ball.setAttribute('number', numbers[i]);
    ballsContainer.appendChild(ball);
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  
  saveHistory(numbers);
  generateBtn.disabled = false;
}

if (generateBtn) generateBtn.addEventListener('click', handleGenerate);
if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener('click', () => {
    if (confirm('최근 생성 내역을 모두 삭제할까요?')) {
      history = [];
      localStorage.removeItem('lotto-history');
      renderHistory();
    }
  });
}

// Initial render
if (historyList) renderHistory();

/**
 * Animal Face Test (Teachable Machine)
 */
const ANIMAL_MODEL_URL = "https://teachablemachine.withgoogle.com/models/lVk_oBQsX/";
let animalModel, animalWebcam, animalLabelContainer, animalMaxPredictions;

window.initAnimalTest = async function() {
    const modelURL = ANIMAL_MODEL_URL + "model.json";
    const metadataURL = ANIMAL_MODEL_URL + "metadata.json";

    const startBtn = document.querySelector('.animal-test-section .glow-button');
    if (startBtn) {
        startBtn.disabled = true;
        startBtn.textContent = '모델 로딩 중...';
    }

    try {
        animalModel = await tmImage.load(modelURL, metadataURL);
        animalMaxPredictions = animalModel.getTotalClasses();

        const flip = true;
        animalWebcam = new tmImage.Webcam(200, 200, flip);
        await animalWebcam.setup();
        await animalWebcam.play();
        window.requestAnimationFrame(animalLoop);

        const webcamContainer = document.getElementById("webcam-container");
        if (webcamContainer) {
            webcamContainer.innerHTML = '';
            webcamContainer.appendChild(animalWebcam.canvas);
        }
        
        animalLabelContainer = document.getElementById("label-container");
        if (animalLabelContainer) {
            animalLabelContainer.innerHTML = '';
            for (let i = 0; i < animalMaxPredictions; i++) {
                animalLabelContainer.appendChild(document.createElement("div"));
            }
        }
        
        if (startBtn) startBtn.textContent = '테스트 중';
    } catch (e) {
        console.error(e);
        alert('카메라 접근 권한이 필요합니다.');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.textContent = '테스트 시작';
        }
    }
}

async function animalLoop() {
    if (animalWebcam) {
        animalWebcam.update();
        await animalPredict();
        window.requestAnimationFrame(animalLoop);
    }
}

async function animalPredict() {
    if (!animalModel || !animalWebcam || !animalLabelContainer) return;
    const prediction = await animalModel.predict(animalWebcam.canvas);
    for (let i = 0; i < animalMaxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(1);
        if (animalLabelContainer.childNodes[i]) {
            animalLabelContainer.childNodes[i].innerHTML = `<span>${className}</span> <span>${probability}%</span>`;
        }
    }
}
