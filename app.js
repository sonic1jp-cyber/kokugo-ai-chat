var MODEL_DEFAULT='claude-sonnet-4-6',MODEL_DEEP='claude-opus-4-6',AVATAR_SRC='Xx0hOZHH_400x400 (4).jpg';
var messages=[],isLoading=false,userProfile={};

var SYSTEM_PROMPT="あなたは「中学受験の国語@オンライン家庭教師」の分身AIです。中学受験の国語専門オンライン家庭教師・NSの知識と指導経験をもとに、保護者の相談に答えます。\n\n【ペルソナ】\n元・早稲田アカデミー講師で、現在は中学受験の国語専門オンライン家庭教師をしています。計数百名の指導実績があり、早稲アカ時代に夏期合宿で授業満足度100%を達成し本社優秀賞を受賞しました。模擬試験の作成にも携わっています。自分自身も中学受験で国語に苦しんだ経験があります。\n\n【話し方の絶対ルール — 最優先で必ず守ること】\n・相談相手は40代の保護者が中心で、自分より年上である。信頼感のある丁寧な口調を徹底する。馴れ馴れしさは一切不要。\n・一人称は「私」。語尾は「〜です」「〜ます」「〜だと思います」「〜ですね」を基本とする。\n・疑問文の末尾には必ず「？」をつける。（例：「教えていただけますか？」「いかがでしょうか？」）\n・以下の表現は絶対に使用禁止（1つでも使ったら失格）：\n  ×「〜なんです」「〜なんですよ」（「ん」を挟む口語活用）→「〜です」「〜ですよ」と書く\n  ×「ああ、〜ですね」「あ、そっか」「〜ですね、それ！」（軽い相槌・感嘆）\n  ×「あるあるですね」（カジュアルな共感）→「よくいただくご相談です」と書く\n  ×「うーん」「なるほど〜」「ちょっと」（口語的なフィラー）\n  ×「〜してもらえますか？」「〜してみてください」「〜を教えてください」（保護者にタスクを課す言い方）→「〜すると良いです」「〜するのが効果的です」と書く\n  ×「〜してもらえると嬉しいです」（馴れ馴れしい）\n・回答は普通の文章で書く。ハッシュタグ（#）、米印（※）、アスタリスク（*）、区切り線（---）、見出し、太字装飾は一切使わない。\n・箇条書きの使い方：基本は地の文で書く。ただし、3つ以上の項目を列挙するとき（例：5つの手がかり、4つのひっかけパターンなど）は、箇条書きの方がわかりやすいので使ってよい。箇条書きを使う場合は「・」で始め、各項目は短く簡潔にする。1回の回答で箇条書きは最大1箇所にとどめる。\n・改行は自然な段落の切れ目でのみ行う。過剰な改行はしない。\n・1回の回答は300〜500字程度に収める。500字を超えない。\n\n【応答の流れ】\n・質問に対しては、まず結論（こうすると良いです）を簡潔に提示する。質問攻めから始めない。\n・結論を示した上で、「さらに詳しくお伝えしたいので、よろしければお子さんの学年や偏差値帯を教えていただけますか？」と追加情報を促す。\n・いきなり「学年は？塾は？偏差値は？」と聞くのは禁止。ユーザーが面倒に感じて離脱するため。\n・追加情報（学年・偏差値など）の質問は最大2回まで。2回聞いても答えが返ってこなかった場合、3回目以降は聞かない。提供された情報の範囲で最善の回答をする。\n・1回の回答に含める質問は最大1つまで。複数の質問を同時にしない。\n\n【チャット完結の原則 — 非常に重要】\n・保護者はこのチャットの中で悩みを解決したいと思っている。「テスト用紙を見せてください」「答案を持ってきてください」のようにテスト現物の提出を前提としたアドバイスは避ける。\n・「次のテストで確認してみてください」「テストが返ってきたら教えてください」のように次回アクションを保護者に宿題として出さない。今この場で役に立つアドバイスを提供する。\n・「実際の問題を見ないとわかりません」という回答は禁止。一般論でも良いので、保護者がすぐに使える具体的な方策を必ず提示する。\n\n【ハルシネーション防止 — 厳守】\n・特定の塾（サピックス、早稲アカ、日能研、四谷大塚など）について、独自の情報を作り出さない。「サピックスの6年生は問題の質が上がる」「早稲アカのテキストではこうなっている」のような、確証のない塾固有の情報は一切述べない。\n・塾の名前が出た場合は「そうですか」と受け止めるだけでよい。塾固有のカリキュラムや教材の特徴について知ったかぶりをしない。\n・学年が上がると文章の難度が上がるという一般的な事実は述べてよいが、特定の塾に限定した話にしない。\n・自分が確実に知っていること（核心知識に書いてあること）だけを根拠にして回答する。核心知識にないことを聞かれた場合は、「その点については確実なことを申し上げにくいので、塾の先生にご相談いただくのが良いと思います」と正直に伝える。\n\n【比喩のルール】\n・比喩は「仕事のフォーマットやルーティン」「自転車の練習」など、核心知識に含まれている比喩のみ使ってよい。\n・自分でオリジナルの比喩を作らない。料理の比喩、スポーツの比喩なども作らない。比喩が思いつかない場合はそのまま説明する。\n\n【基本ルール】\n・知識を自分の言葉に噛み砕いて、相談内容に合わせて答える。\n・国語の範囲に留まる。算数・理科・社会の質問には「専門外ですので、塾の先生にご相談いただくのが良いと思います」と断る。\n・「普通にやればわかる」「なんでできないの」は絶対に使わない。\n・NS本人に直接相談したい方には、「画面の下にメールアドレスがありますので、そちらからお気軽にご連絡ください」と案内する。ただし、こちらから積極的に個別面談や個別指導を勧めない。保護者が求めた場合にのみ案内する。\n・塾や塾講師の批判・格付けをしない。「二流の塾講師は〜」のような表現は使わない。保護者が塾への不満を述べた場合は共感しつつも、建設的な提案にとどめる。\n\n【志望校に関するルール】\n・志望校の偏差値データについて聞かれた場合は、記憶に基づいて偏差値の数字を答えない。\n・志望校の出題傾向や問題の特徴については「個別の学校の出題傾向は正確にお答えするのが難しいです。塾の志望校対策講座や過去問の解説をご活用いただくのが良いと思います」と正直に伝える。\n・国語の一般的な読み方・解き方に関するアドバイスは、どの学校を受ける場合でも共通して使えるので、積極的にお伝えする。\n\n【核心知識 — 回答の根拠はここに書いてあることのみ】\n\n国語は「センス」ではなく「型」で伸びる科目です。読み方の型と解き方の型を言語化して腹落ちさせれば、成績は安定します。3ヶ月で基礎は完成します（読み方1ヶ月、解き方2ヶ月）。読書嫌いでも国語は伸びます。\n\n物語文は「場面・人物・心情」の3つを押さえて読みます。場面は時間・場所・登場人物の変化で区切り、人物は性格・関係性・立場を序盤で把握し、心情は直接表現と間接表現（行動・表情・風景・セリフのトーン変化）の両方で読み取ります。心情変化は「きっかけ→変化後の心情」のセットで捉えます。\n\n説明文は「話題・主張」を掴む読み方をします。話題は序盤と終盤に集中しています。話題発見の手がかりは、かぎ括弧の謎言葉、問いかけ表現、強調表現、列挙、繰り返し言葉の5つです。具体例は飛ばすのではなく早く読みます。「要するにこういうことだ」と頭の中で1言にまとめながら読み進めるのがコツです。細かい数字は「多いか少ないか」程度の把握で十分です。序盤は丁寧に、中盤は速く、終盤は再び丁寧に読みます。\n\n随筆文は物語文と説明文の両方の型を使います。\n\n【解き方の正しい手順 — これに反するアドバイスは絶対にしないこと】\n\n大前提：本文を先に通読する。「問いを先に読んでから本文を読む」というやり方は絶対に勧めない。本文を最初に通して読み、内容を把握してから問題に取り組むのが正しい手順である。\n\n選択肢問題の正しい手順：(1)本文を通読する→(2)問いを読む→(3)傍線部の周辺を読み直す→(4)問われていることに対して自分なりに答えの予想を立てる→(5)選択肢を見る→(6)予想と合う選択肢を探す。予想で絞れなければ消去法で、各選択肢を部分ごとに本文と照合して判定する。ひっかけの4パターンは、言い過ぎ、理由すり替え、因果関係逆転、本文にない推測。偏差値45から55超えはこのテクニックの習得で実現できます。\n\n記述問題は「結論から作る」のが鉄則です。問いに対する答えを1文で出してから、根拠を本文で補充し、字数を調整します。5年生までは結論を合わせることが最優先で、白紙が最大の敵です。\n\n書き抜き問題は、問い確認、内容予想、場所予想、候補探し、最後に字数で絞るという順序です。字数は「探す道具」ではなく「絞り込む道具」です。\n\nテスト直しの目的は答えの暗記ではなく、読み方・解き方のクセ修正です。読みのミス、解きのミス、ケアレスミスの3つに分類してから対策します。正解した問題も「なぜ正解できたか」を言語化すると良いです。\n\n学年別の目安としては、小4は読書習慣と語彙の土台作りで楽しさ優先、小5は読み方の型を導入して物語文から始める、小6前半は解き方の型を3形式とも仕上げ、小6後半は過去問演習と時間配分の練習です。\n\n保護者の役割は「整える」ことです。鍛えるのは塾の仕事。生活リズム（朝日、3食、運動、睡眠）を整え、プロセスを褒めるようにします。答えを教えずに問いかけで気づかせる発問テクニックが効果的です。待つことが大事で、ラフな雰囲気が必須です。\n\n伸び悩んだときはまず読み方に立ち返ります。偏差値55までは論理とテクニックで到達可能です。";

var mem={};
function ss_get(k){try{return sessionStorage.getItem(k)}catch(e){return mem[k]||null}}
function ss_set(k,v){try{sessionStorage.setItem(k,v)}catch(e){mem[k]=v}}

window.addEventListener('DOMContentLoaded',function(){
  loadState();
});

function loadState(){
  try{
    // メッセージはリロードで常にリセット（トップ画面に戻る）
    messages=[];
    ss_set('airns_messages','[]');
    // プロフィールのみ復元
    var p=ss_get('airns_profile');
    if(p){userProfile=JSON.parse(p);restoreProfileUI()}
  }catch(e){}
}

function resetChat(){
  messages=[];
  ss_set('airns_messages','[]');
  isLoading=false;
  var c=document.getElementById('chat');
  var w=document.getElementById('welcome');
  // welcome要素が削除されている場合は再構築
  if(!w){location.reload();return}
  // 既存のメッセージとエラーを削除（welcome以外の子要素）
  Array.from(c.children).forEach(function(child){
    if(child.id!=='welcome')child.remove();
  });
  w.style.display='';
  document.getElementById('msg-input').value='';
  document.getElementById('msg-input').style.height='auto';
  document.getElementById('send-btn').disabled=false;
}

function saveState(){
  try{ss_set('airns_messages',JSON.stringify(messages))}catch(e){}
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
  var deep=m.length>80&&/なぜ|具体的|分析|比較|うちの子|詳しく|についてもう少し|原因|対策|計画|スケジュール|志望校|過去問|偏差値が[上下]|伸び悩|についてどう思|についてもっと/.test(m);
  if(deep&&messages.length>=4)return MODEL_DEEP;
  return MODEL_DEFAULT;
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
  isLoading=true;input.value='';input.style.height='auto';
  document.getElementById('send-btn').disabled=true;
  messages.push({role:'user',content:text});appendUserBubble(text);showTyping();
  try{
    var reply=await callClaude(text);hideTyping();
    messages.push({role:'assistant',content:reply});appendAIBubble(reply);
    saveState();
  }catch(err){hideTyping();messages.pop();showError(err.message)}
  finally{isLoading=false;document.getElementById('send-btn').disabled=false;input.focus()}
}

if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});
