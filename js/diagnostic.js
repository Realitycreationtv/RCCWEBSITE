/* ============================================================
   Reality Creation Centre — Fulfilment Diagnostic Engine
   Version 1.0
   ============================================================ */

(function() {

  const QUESTIONS = [
    {
      area: 'Mental',
      q: '"How often do you feel genuinely clear-headed — able to think, decide, and process without being overwhelmed by noise, doubt or overthinking?"',
      opts: [
        { t: 'Almost always. My mind feels clear and focused.', s: 4 },
        { t: 'Often enough. I have good days but also foggy ones.', s: 3 },
        { t: 'Rarely. My mind feels cluttered more than calm.', s: 2 },
        { t: 'Almost never. Overthinking and mental noise are constant companions.', s: 1 }
      ]
    },
    {
      area: 'Physical',
      q: '"How honestly would you say your body feels — in terms of energy, vitality, and the way you physically move through life?"',
      opts: [
        { t: 'Energised. I feel strong and alive in my body.', s: 4 },
        { t: 'Functional. I manage, but I know I could feel better.', s: 3 },
        { t: 'Depleted. I push through most days on low reserves.', s: 2 },
        { t: 'Disconnected. I rarely listen to what my body is telling me.', s: 1 }
      ]
    },
    {
      area: 'Spiritual',
      q: '"How connected do you feel to something larger than yourself — meaning, faith, nature, or a sense of purpose beyond the personal?"',
      opts: [
        { t: 'Deeply connected. There is a thread I follow.', s: 4 },
        { t: 'Occasionally. I feel it in certain moments but not consistently.', s: 3 },
        { t: 'Rarely. It is something I sense I am missing.', s: 2 },
        { t: 'Disconnected. That dimension of life feels distant or absent.', s: 1 }
      ]
    },
    {
      area: 'Emotional',
      q: '"How fully do you allow yourself to feel — and how honestly do you process what you experience rather than suppress or avoid it?"',
      opts: [
        { t: 'Fully. I feel and process with awareness and self-compassion.', s: 4 },
        { t: 'Partially. I allow some emotions but push others down.', s: 3 },
        { t: 'Rarely. I tend to suppress more than I express.', s: 2 },
        { t: 'Almost never. I avoid emotional depth as much as possible.', s: 1 }
      ]
    },
    {
      area: 'Relationships',
      q: '"How often do you feel truly known — not just liked or needed — by the people around you?"',
      opts: [
        { t: 'Deeply. I have people who see me as I actually am.', s: 4 },
        { t: 'Partially. Some people, but the depth I want is not there.', s: 3 },
        { t: 'Rarely. Most relationships stay at the surface.', s: 2 },
        { t: 'Almost never. I feel unseen even with those I am close to.', s: 1 }
      ]
    },
    {
      area: 'Purpose',
      q: '"When you wake up in the morning, how often do you feel genuinely drawn toward your day — not obligated to it?"',
      opts: [
        { t: 'Almost always. There is something that calls me forward.', s: 4 },
        { t: 'Sometimes. On good days I feel it, on others it fades.', s: 3 },
        { t: 'Rarely. I go through the motions more than I would like.', s: 2 },
        { t: 'Almost never. I am not sure what I would even be drawn to.', s: 1 }
      ]
    },
    {
      area: 'Financial',
      q: '"How would you honestly describe your relationship with money — not just the amount, but the freedom, security and alignment it brings?"',
      opts: [
        { t: 'Healthy. Money supports my life without controlling it.', s: 4 },
        { t: 'Functional. Stable enough but not aligned with my values.', s: 3 },
        { t: 'Strained. Financial pressure affects how I live and choose.', s: 2 },
        { t: 'Avoidant. I struggle to face this area honestly.', s: 1 }
      ]
    }
  ];

  function getProfile(total, areas) {
    const pct  = Math.round((total / 28) * 100);
    const min  = areas.reduce((a, b) => b.score < a.score ? b : a, areas[0]);

    if (pct >= 80) return {
      level: 'Deeply Fulfilled', em: 'aligned & expanding',
      pat: 'The Purposeful Architect',
      ins: '"You have done substantial inner work across all seven areas. You move through life with a degree of clarity and wholeness that most people only glimpse occasionally."',
      ch: `Your next challenge is sustaining what you've built without letting comfort become complacency. Your lowest area — <strong>${min.area}</strong> — may be quietly asking for more attention.`
    };
    if (pct >= 60) return {
      level: 'Selectively Fulfilled', em: 'capable but fragmented',
      pat: 'The High Achiever in Transition',
      ins: '"You are capable, often successful, and have meaningful things in your life. But fulfilment is arriving in pockets rather than as a whole across the seven areas."',
      ch: `The gap lives between your strongest and weakest areas. Focus on <strong>${min.area}</strong> — that is where the next chapter begins.`
    };
    if (pct >= 40) return {
      level: 'Searching for Fulfilment', em: 'functional but unfulfilled',
      pat: 'The Capable Drifter',
      ins: '"The routines work. The life looks fine from the outside. But across several of the seven areas, something important is missing — and you sense it."',
      ch: `The Centre\'s structured programs were built for exactly this moment. Start with <strong>${min.area}</strong> — that is your most urgent area right now.`
    };
    return {
      level: 'At a Crossroads', em: 'ready for transformation',
      pat: 'The Awakening Seeker',
      ins: '"Something has cracked open. You are at one of the most important junctures in your life — and the Reality Creation Centre exists precisely for this moment."',
      ch: `This is not a crisis. It is a doorway. Begin with <strong>${min.area}</strong> and let the community walk alongside you.`
    };
  }

  let step = 0, answers = [], selected = null;

  const overlay  = document.getElementById('d-ov');
  const qWrap    = document.getElementById('d-qwrap');
  const rWrap    = document.getElementById('d-rwrap');
  const stepLbl  = document.getElementById('d-slbl');
  const qText    = document.getElementById('d-qtext');
  const aTag     = document.getElementById('d-atag');
  const optsCont = document.getElementById('d-opts');
  const progBar  = document.getElementById('d-prog');
  const backBtn  = document.getElementById('d-back');
  const nextBtn  = document.getElementById('d-next');

  if (!overlay) return; // diagnostic not on this page

  function openDiagnostic() {
    step = 0; answers = []; selected = null;
    rWrap.classList.remove('show');
    qWrap.classList.remove('hide');
    render();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDiagnostic() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open triggers
  document.querySelectorAll('[data-diag-open], #d-open').forEach(el => {
    el.addEventListener('click', openDiagnostic);
  });

  document.getElementById('d-close').addEventListener('click', closeDiagnostic);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeDiagnostic(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDiagnostic(); });

  function render() {
    const q   = QUESTIONS[step];
    const tot = QUESTIONS.length;

    stepLbl.textContent = `Question ${step + 1} of ${tot}`;
    qText.textContent   = q.q;
    aTag.textContent    = q.area;
    progBar.style.width = ((step / tot) * 100) + '%';
    backBtn.style.visibility = step === 0 ? 'hidden' : 'visible';

    selected = answers[step] !== undefined ? answers[step] : null;
    nextBtn.classList.toggle('rdy', selected !== null);

    optsCont.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'd-opt' + (selected === i ? ' sel' : '');
      btn.innerHTML = `<div class="d-ind"><div class="d-dot"></div></div><div class="d-otext">${opt.t}</div>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.d-opt').forEach(x => x.classList.remove('sel'));
        btn.classList.add('sel');
        selected = i;
        answers[step] = i;
        nextBtn.classList.add('rdy');
      });
      optsCont.appendChild(btn);
    });
  }

  nextBtn.addEventListener('click', () => {
    if (selected === null) return;
    if (step < QUESTIONS.length - 1) {
      step++;
      selected = answers[step] !== undefined ? answers[step] : null;
      render();
    } else {
      showResults();
    }
  });

  backBtn.addEventListener('click', () => {
    if (step > 0) { step--; render(); }
  });

  document.getElementById('d-retake').addEventListener('click', () => {
    step = 0; answers = []; selected = null;
    rWrap.classList.remove('show');
    qWrap.classList.remove('hide');
    render();
  });

  function showResults() {
    progBar.style.width = '100%';
    const areaScores = QUESTIONS.map((q, i) => ({
      area:  q.area,
      score: answers[i] !== undefined ? q.opts[answers[i]].s : 1
    }));
    const total   = areaScores.reduce((s, a) => s + a.score, 0);
    const profile = getProfile(total, areaScores);

    document.getElementById('rl-level').innerHTML = `${profile.level}<br><em>${profile.em}</em>`;
    document.getElementById('rl-pat').textContent  = profile.pat;
    document.getElementById('rl-ins').textContent  = profile.ins;
    document.getElementById('rl-ch').innerHTML     = profile.ch;

    const areasList = document.getElementById('rl-areas');
    areasList.innerHTML = '';
    areaScores.forEach(a => {
      const pct = Math.round((a.score / 4) * 100);
      const div = document.createElement('div');
      div.className = 'rl-area';
      div.innerHTML = `
        <div class="rl-al">
          <div class="rl-aname">${a.area}</div>
          <div class="rl-track"><div class="rl-fill" style="width:0%" data-w="${pct}"></div></div>
        </div>
        <div class="rl-pct">${pct}</div>`;
      areasList.appendChild(div);
    });

    qWrap.classList.add('hide');
    rWrap.classList.add('show');

    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelectorAll('.rl-fill').forEach(el => {
        el.style.width = el.dataset.w + '%';
      });
    }));
  }

})();
