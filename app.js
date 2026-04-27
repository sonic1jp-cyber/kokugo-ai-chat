var MONTHLY_LIMIT=10,MODEL_SIMPLE='claude-haiku-4-5-20251001',MODEL_COMPLEX='claude-sonnet-4-6',AVATAR_SRC='Xx0hOZHH_400x400 (4).jpg';
var messages=[],usageCount=0,isLoading=false,lowUsageWarned=false,userProfile={};

var SYSTEM_PROMPT="あなたは「中学受験の国語@オンライン家庭教師」の分身AIです。中学受験の国語専門オンライン家庭教師・NSの知識と指導経験をもとに、保護者の相談に答えます。\n\n【ペルソナ】\n元・早稲田アカデミー講師で、現在は中学受験の国語専門オンライン家庭教師をしています。計数百名の指導実績があり、早稲アカ時代に夏期合宿で授業満足度100%を達成し本社優秀賞を受賞しました。模擬試験の作成にも携わっています。自分自身も中学受験で国語に苦しんだ経験があります。\n\n【話し方の絶対ルール】\n・相談相手は40代の保護者が中心で、自分より年上である。信頼感のある丁寧な口調を徹底する。馴れ馴れしさは一切不要。\n・一人称は「私」。語尾は「〜です」「〜ます」「〜だと思います」「〜ですね」を基本とする。\n・「〜なんです」「〜なんですよ」のように「ん」を挟む口語的な活用は使わない。「〜です」「〜ですよ」と書く。\n・「ああ、〜ですね」「あ、そっか」「〜ですね、それ！」のような軽い相槌や感嘆は使わない。相談を軽く受け止めている印象を与えるため。\n・「あるあるですね」のようなカジュアルな共感表現も使わない。「よくいただくご相談です」のように丁寧に言い換える。\n・回答は普通の文章で書く。ハッシュタグ（#）、米印（※）、アスタリスク（*）、区切り線（---）、見出し、太字装飾は一切使わない。\n・箇条書きの使い方：基本は地の文で書く。ただし、3つ以上の項目を列挙するとき（例：5つの手がかり、4つのひっかけパターンなど）は、箇条書きの方がわかりやすいので使ってよい。箇条書きを使う場合は「・」で始め、各項目は短く簡潔にする。箇条書きに頼りすぎるとAI臭くなるので、1回の回答で箇条書きは最大1箇所にとどめる。\n・改行は自然な段落の切れ目でのみ行う。過剰な改行はしない。\n・1回の回答は300〜500字程度に収める。\n\n【応答の流れ】\n・質問に対しては、まず結論（こうすると良いです）を簡潔に提示する。質問攻めから始めない。\n・結論を示した上で、「さらに詳しくお伝えしたいので、よろしければお子さんの学年や偏差値帯を教えていただけますか」と追加情報を促す。\n・いきなり「学年は？塾は？偏差値は？」と聞くのは禁止。ユーザーが面倒に感じて離脱するため。\n・追加情報（学年・偏差値など）の質問は最大2回まで。2回聞いても答えが返ってこなかった場合、3回目以降は聞かない。提供された情報の範囲で最善の回答をする。しつこく聞くと離脱につながる。\n\n【比喩のルール】\n・比喩は「仕事のフォーマットやルーティン」「自転車の練習」など、完全攻略マニュアルで使われている比喩のみ使ってよい。\n・自分でオリジナルの比喩を作らない。下手な比喩はない方が良い。比喩が思いつかない場合はそのまま説明する。\n\n【提案の仕方】\n・「〜してもらえますか？」「〜してみてください」のように保護者にタスクを課す言い方は避ける。\n・「〜すると良いです」「〜するのが効果的です」のように、具体的な方策を提案・サジェストする形で書く。保護者の負担感を増やさない。\n\n【基本ルール】\n・マニュアルの文章をそのまま引用しない。知識を自分の言葉に噛み砕いて、相談内容に合わせて答える。\n・国語の範囲に留まる。算数・理科・社会の質問には「専門外ですので、塾の先生にご相談いただくのが良いと思います」と断る。\n・「普通にやればわかる」「なんでできないの」は絶対に使わない。保護者にもこうした声かけを避けるようお伝えする。\n・NS本人へのオンライン相談や有料プランの話は、自分からは一切しない。聞かれた場合のみ「画面の下にリンクがあります」と案内する。\n\n【志望校に関するルール】\n・志望校の偏差値データについて聞かれた場合は、「併願パターン提案ツールに偏差値データがまとまっていますので、そちらをご確認いただくのが正確です」と案内する。記憶に基づいて偏差値の数字を答えない（誤りのリスクがあるため）。\n・志望校の出題傾向や問題の特徴については「個別の学校の出題傾向は私の専門外ですので、お答えが難しいです。塾の志望校対策講座や過去問の解説をご活用いただくのが良いと思います」と正直に伝える。\n・国語の一般的な読み方・解き方に関するアドバイスは、どの学校を受ける場合でも共通して使えるので、積極的にお伝えする。\n\n【核心知識】\n\n国語は「センス」ではなく「型」で伸びる科目です。読み方の型と解き方の型を言語化して腹落ちさせれば、成績は安定します。3ヶ月で基礎は完成します（読み方1ヶ月、解き方2ヶ月）。読書嫌いでも国語は伸びます。\n\n物語文は「場面・人物・心情」の3つを押さえて読みます。場面は時間・場所・登場人物の変化で区切り、人物は性格・関係性・立場を序盤で把握し、心情は直接表現と間接表現（行動・表情・風景・セリフのトーン変化）の両方で読み取ります。心情変化は「きっかけ→変化後の心情」のセットで捉えます。\n\n説明文は「話題・主張」を掴む読み方をします。話題は序盤と終盤に集中しています。話題発見の手がかりは、かぎ括弧の謎言葉、問いかけ表現、強調表現、列挙、繰り返し言葉の5つです。具体例は飛ばすのではなく早く読みます。「要するにこういうことだ」と頭の中で1言にまとめながら読み進めるのがコツです。細かい数字は「多いか少ないか」程度の把握で十分です。序盤は丁寧に、中盤は速く、終盤は再び丁寧に読みます。\n\n随筆文は物語文と説明文の両方の型を使います。\n\n記述問題は「結論から作る」のが鉄則です。問いに対する答えを1文で出してから、根拠を本文で補充し、字数を調整します。5年生までは結論を合わせることが最優先で、白紙が最大の敵です。\n\n選択肢問題は「予想してから見る」がポイントです。本文から答えの方向を予想してから選択肢を見て、部分ごとに判定して消去します。ひっかけは、言い過ぎ、理由すり替え、因果関係逆転、本文にない推測の4パターンです。偏差値45から55超えはこのテクニックの習得で実現できます。\n\n書き抜き問題は、問い確認、内容予想、場所予想、候補探し、最後に字数で絞るという順序です。字数は「探す道具」ではなく「絞り込む道具」です。\n\nテスト直しの目的は答えの暗記ではなく、読み方・解き方のクセ修正です。読みのミス、解きのミス、ケアレスミスの3つに分類してから対策します。正解した問題も「なぜ正解できたか」を言語化します。\n\n学年別の目安としては、小4は読書習慣と語彙の土台作りで楽しさ優先、小5は読み方の型を導入して物語文から始める、小6前半は解き方の型を3形式とも仕上げ、小6後半は過去問演習と時間配分の練習です。\n\n保護者の役割は「整える」ことです。鍛えるのは塾の仕事。生活リズム（朝日、3食、運動、睡眠）を整え、プロセスを褒めるようにします。発問テクニックで、答えを教えずに問いかけで気づかせます。待つことが大事で、ラフな雰囲気が必須です。\n\n塾講師の質は三段階で見分けます。三流はできないことの指摘だけ、二流は理由を説明してくれる、一流は解決策まで提示してくれます。集団塾は読み方指導が構造的に不足しがちなので、家庭か個別で補います。\n\n伸び悩んだときはまず読み方に立ち返ります。スマホで解いている姿を録画して分析すると効果的です。偏差値55までは論理とテクニックで到達可能です。";

var mem={};
function ss_get(k){try{return sessionStorage.getItem(k)}catch(e){return mem[k]||null}}
function ss_set(k,v){try{sessionStorage.setItem(k,v)}catch(e){mem[k]=v}}

window.addEventListener('DOMContentLoaded',function(){
  loadState();updateUsageBadge();
});

function loadState(){
  try{
    usageCount=parseInt(ss_get('airns_usage')||'0');
    var s=ss_get('airns_messages');
    if(s){messages=JSON.parse(s);if(messages.length>0)renderAllMessages()}
    var p=ss_get('airns_profile');
    if(p){userProfile=JSON.parse(p);restoreProfileUI()}
  }catch(e){}
}

function saveState(){
  try{ss_set('airns_usage',usageCount.toString());ss_set('airns_messages',JSON.stringify(messages))}catch(e){}
}

function toggleProfile(){
  document.getElementById('profile-toggle').classList.toggle('open');
  document.getElementById('profile-panel').classList.toggle('open');
}

function toggleOtherJuku(){
  var s=document.getElementById('prof-juku'),o=document.getElementById('prof-juku-other');
  o.classList.toggle('visible',s.value==='other');if(s.value!=='other')o.value='';
}
function toggleOtherText(){
  var s=document.getElementById('prof-text-type'),o=document.getElementById('prof-text-other');
  o.classList.toggle('visible',s.value==='other');if(s.value!=='other')o.value='';
}
function toggleOtherQ(){
  var s=document.getElementById('prof-q-type'),o=document.getElementById('prof-q-other');
  o.classList.toggle('visible',s.value==='other');if(s.value!=='other')o.value='';
}

function saveProfile(){
  var g=document.getElementById('prof-grade').value;
  var h=document.getElementById('prof-hensachi').value;
  var js=document.getElementById('prof-juku').value;
  var jo=document.getElementById('prof-juku-other').value;
  var ts=document.getElementById('prof-text-type').value;
  var to2=document.getElementById('prof-text-other').value;
  var qs=document.getElementById('prof-q-type').value;
  var qo=document.getElementById('prof-q-other').value;
  var w=document.getElementById('prof-worry').value.trim();
  userProfile={};
  if(g)userProfile.grade=g;
  if(h)userProfile.hensachi=h;
  if(js==='other'&&jo)userProfile.juku=jo;else if(js&&js!=='other')userProfile.juku=js;
  if(ts==='other'&&to2)userProfile.textType=to2;else if(ts&&ts!=='other')userProfile.textType=ts;
  if(qs==='other'&&qo)userProfile.qType=qo;else if(qs&&qs!=='other')userProfile.qType=qs;
  if(w)userProfile.worry=w;
  try{ss_set('airns_profile',JSON.stringify(userProfile))}catch(e){}
  var sv=document.getElementById('profile-saved');sv.classList.add('show');setTimeout(function(){sv.classList.remove('show')},2000);
}

function restoreProfileUI(){
  if(userProfile.grade)document.getElementById('prof-grade').value=userProfile.grade;
  if(userProfile.hensachi)document.getElementById('prof-hensachi').value=userProfile.hensachi;
  if(userProfile.juku){
    var s=document.getElementById('prof-juku');
    var opts=Array.from(s.options).map(function(o){return o.value});
    if(opts.indexOf(userProfile.juku)>=0)s.value=userProfile.juku;
    else{s.value='other';document.getElementById('prof-juku-other').value=userProfile.juku;document.getElementById('prof-juku-other').classList.add('visible')}
  }
  if(userProfile.textType){
    var s2=document.getElementById('prof-text-type');
    var o2=Array.from(s2.options).map(function(o){return o.value});
    if(o2.indexOf(userProfile.textType)>=0)s2.value=userProfile.textType;
    else{s2.value='other';document.getElementById('prof-text-other').value=userProfile.textType;document.getElementById('prof-text-other').classList.add('visible')}
  }
  if(userProfile.qType){
    var s3=document.getElementById('prof-q-type');
    var o3=Array.from(s3.options).map(function(o){return o.value});
    if(o3.indexOf(userProfile.qType)>=0)s3.value=userProfile.qType;
    else{s3.value='other';document.getElementById('prof-q-other').value=userProfile.qType;document.getElementById('prof-q-other').classList.add('visible')}
  }
  if(userProfile.worry)document.getElementById('prof-worry').value=userProfile.worry;
}

function buildProfileContext(){
  var p=[];
  if(userProfile.grade)p.push('学年: '+userProfile.grade);
  if(userProfile.hensachi)p.push('偏差値: '+userProfile.hensachi);
  if(userProfile.juku)p.push('通塾: '+userProfile.juku);
  if(userProfile.textType)p.push('苦手な文章: '+userProfile.textType);
  if(userProfile.qType)p.push('苦手な問題: '+userProfile.qType);
  if(userProfile.worry)p.push('悩み: '+userProfile.worry);
  if(p.length===0)return'';
  return'\n\n【この保護者のお子さんの情報】\n'+p.join('\n');
}

function updateUsageBadge(){
  var r=Math.max(0,MONTHLY_LIMIT-usageCount);
  document.getElementById('usage-badge').textContent='残り質問回数 '+r+'/'+MONTHLY_LIMIT;
}

function showLowUsageWarning(remaining){
  if(remaining>3||lowUsageWarned)return;
  lowUsageWarned=true;
  var c=document.getElementById('chat'),d=document.createElement('div');
  d.className='usage-warning';
  d.innerHTML='今月の残り質問回数はあと<strong>'+remaining+'回</strong>です。もっと相談したい方は<a href="#" onclick="openPlanModal();return false">有料プラン</a>もご検討ください。';
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}

function autoResize(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,120)+'px'}

function handleKeydown(e){if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();handleSubmit(e)}}

function renderAllMessages(){
  var c=document.getElementById('chat'),w=document.getElementById('welcome');
  if(w)w.style.display='none';c.innerHTML='';
  messages.forEach(function(m){if(m.role==='user')appendUserBubble(m.content);else appendAIBubble(m.content)});
}

function appendUserBubble(t){
  var c=document.getElementById('chat'),w=document.getElementById('welcome');
  if(w)w.style.display='none';
  var d=document.createElement('div');d.className='message user';
  d.innerHTML='<div class="bubble">'+escapeHtml(t)+'</div>';
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}

function appendAIBubble(t){
  var c=document.getElementById('chat'),d=document.createElement('div');
  d.className='message ai';
  d.innerHTML='<div class="ai-avatar"><img src="'+AVATAR_SRC+'" alt="NS"></div><div class="bubble">'+formatText(t)+'</div>';
  c.appendChild(d);c.scrollTop=c.scrollHeight;return d;
}

function showTyping(){
  var c=document.getElementById('chat'),d=document.createElement('div');
  d.className='message ai';d.id='typing';
  d.innerHTML='<div class="ai-avatar"><img src="'+AVATAR_SRC+'" alt="NS"></div><div class="bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
  c.appendChild(d);c.scrollTop=c.scrollHeight;
}

function hideTyping(){var e=document.getElementById('typing');if(e)e.remove()}

function showError(msg){
  var c=document.getElementById('chat'),d=document.createElement('div');
  d.className='error-msg';d.textContent=msg;c.appendChild(d);c.scrollTop=c.scrollHeight;
}

function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function formatText(s){
  var t=s;
  t=t.replace(/^#{1,4}\s+/gm,'');
  t=t.replace(/\*\*([^*]+)\*\*/g,'$1');
  t=t.replace(/\*([^*]+)\*/g,'$1');
  t=t.replace(/^[-•]\s+/gm,'');
  t=t.replace(/^\d+\.\s+/gm,'');
  t=t.replace(/^---+$/gm,'');
  t=t.replace(/#\S+/g,'');
  t=t.replace(/\n{3,}/g,'\n\n');
  t=t.trim();
  return escapeHtml(t).replace(/\n/g,'<br>');
}

function sendQuickQ(btn){document.getElementById('msg-input').value=btn.textContent;handleSubmit(new Event('submit'))}

function chooseModel(m){
  var simple=/^.{0,30}$/.test(m)||/こんにちは|ありがとう|はじめまして/.test(m);
  return simple?MODEL_SIMPLE:MODEL_COMPLEX;
}

async function callClaude(userMsg){
  var model=chooseModel(userMsg);
  var apiMessages=messages.slice(-20).map(function(m){return{role:m.role,content:m.content}});
  var fullSystem=SYSTEM_PROMPT+buildProfileContext();
  var res=await fetch('/api/chat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:model,max_tokens:1024,system:[{type:'text',text:fullSystem,cache_control:{type:'ephemeral'}}],messages:apiMessages})
  });
  if(!res.ok){
    var err=await res.json().catch(function(){return{}});
    if(res.status===429)throw new Error('リクエスト制限に達しました。少し待ってからお試しください。');
    throw new Error((err.error&&err.error.message)||'サーバーエラーが発生しました ('+res.status+')');
  }
  var data=await res.json();return data.content[0].text;
}

async function handleSubmit(e){
  e.preventDefault();
  var input=document.getElementById('msg-input'),text=input.value.trim();
  if(!text||isLoading)return;
  if(usageCount>=MONTHLY_LIMIT){openPlanModal();return}
  isLoading=true;input.value='';input.style.height='auto';
  document.getElementById('send-btn').disabled=true;
  messages.push({role:'user',content:text});appendUserBubble(text);showTyping();
  try{
    var reply=await callClaude(text);hideTyping();
    messages.push({role:'assistant',content:reply});appendAIBubble(reply);
    usageCount++;updateUsageBadge();saveState();
    showLowUsageWarning(MONTHLY_LIMIT-usageCount);
  }catch(err){hideTyping();messages.pop();showError(err.message)}
  finally{isLoading=false;document.getElementById('send-btn').disabled=false;input.focus()}
}

function openPlanModal(){document.getElementById('plan-modal').classList.add('active')}
function closePlanModal(){document.getElementById('plan-modal').classList.remove('active')}
function selectPlan(p){alert(p==='basic'?'ベーシックプラン（月額680円）の決済機能は現在準備中です。':'プレミアムプラン（月額1,980円）の決済機能は現在準備中です。')}
function openConsultationModal(){document.getElementById('consultation-modal').classList.add('active')}
function closeConsultationModal(){document.getElementById('consultation-modal').classList.remove('active')}
function selectConsultation(t){alert(t==='short'?'スポット相談（30分 5,000円）の申し込みフォームは準備中です。':'じっくり相談（60分 8,800円）の申し込みフォームは準備中です。')}

if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});
