(function() {
    // === 1. 参数配置 ===
    const EXCELLENT_RATE = 95; // 优秀率百分比（95%打最高分10分，5%打9分）
    const AUTO_SUBMIT = false; // 智能半自动：由您手动确认提交，脚本自动加载下一位并自动填充，防止弹窗打断！
    const DELAY_MS = 1000;     // 页面加载出来后，等待多久进行填充（毫秒）
    
    const COMMENTS = [
        "老师上课非常认真，讲解清晰透彻，重难点突出，对学生非常负责，受益匪浅。",
        "教学态度十分端正，备课充分，课堂氛围活跃，能及时耐心解答学生的疑问。",
        "老师授课很有条理，深入浅出，课后辅导仔细，注重理论与实际相结合，指导非常到位。",
        "课堂教学方法灵活，课外作业设计适中且反馈很及时，有助于我对专业知识的开拓和理解。",
        "老师非常具有亲和力，讲课内容丰富生动，课堂讨论热烈，极大地激发了我的学习兴趣。",
        "老师授课逻辑严密，重点突出，教学认真负责，对每个学生都一视同仁，非常优秀。"
    ];

    console.log("%c【ECUST 批量评教助手】已启动半自动流式模式...", "color: #004F9F; font-weight: bold; font-size: 14px;");
    console.log("%c💡 运行说明：脚本会自动帮您加载老师、完成填充，请您在网页下方手动点击[提交]，完成后助手会自动帮您载入下一位！", "color: #FF8C00;");

    // === 2. 搜集待评教链接 ===
    const links = Array.from(document.querySelectorAll('a')).filter(a => {
        const text = a.textContent.trim();
        const href = a.getAttribute('href') || '';
        return (text === '进入评价' || href.includes('xspj_edit.do'));
    });

    if (links.length === 0) {
        console.warn("【ECUST 批量评教助手】未找到任何待评教的链接！请确认您已处于课程列表页。");
        alert("未找到待评教的课程列表！");
        return;
    }

    const queue = links.map(a => {
        let href = a.getAttribute('href');
        if (href && href.startsWith('javascript:')) {
            const match = href.match(/'([^']+)'/);
            if (match) href = match[1];
        }
        if (href && !href.startsWith('http')) {
            const base = window.location.origin + (window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1));
            href = new URL(href, base).href;
        }
        return { url: href, text: a.textContent.trim() };
    }).filter(item => item.url);

    console.log(`%c【ECUST 批量评教助手】发现 ${queue.length} 门待评课程。即将开始全自动评教...`, "color: #004F9F;");

    // 创建主 iframe
    let iframe = document.getElementById('eval-helper-iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'eval-helper-iframe';
        iframe.style.width = '100%';
        iframe.style.height = '500px';
        iframe.style.border = '3px dashed #004F9F';
        iframe.style.marginTop = '20px';
        iframe.style.borderRadius = '8px';
        document.body.appendChild(iframe);
    }
    
    let currentIndex = 0;
    let favoriteCount = 0; // 最喜欢课程名额上限为 3 个

    // === 3. 队列调度 ===
    function processNext() {
        if (currentIndex >= queue.length) {
            console.log("%c🎉【ECUST 批量评教助手】所有课程已全部评教完成！", "color: green; font-weight: bold; font-size: 14px;");
            alert("恭喜！所有课程评教已全部完成！");
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
            window.location.reload();
            return;
        }

        const task = queue[currentIndex];
        console.log(`%c👉 [%c${currentIndex + 1}/${queue.length}%c] 正在加载: %c${task.text}`, "color: #555;", "color: red; font-weight: bold;", "color: #555;", "color: blue; font-weight: bold;");

        // 将当前课程载入列表下方的 iframe 框中
        iframe.src = task.url;

        // 定位滚动条到 iframe，方便用户查看和操作
        iframe.scrollIntoView({ behavior: 'smooth', block: 'end' });

        let nextTriggered = false;
        function gotoNext() {
            if (nextTriggered) return;
            nextTriggered = true;
            clearInterval(timer);
            currentIndex++;
            setTimeout(processNext, 600);
        }

        const timer = setInterval(() => {
            try {
                const subWin = iframe.contentWindow;
                const doc = subWin.document;
                const subRadios = doc.querySelectorAll('input[type="radio"]');
                
                if (subRadios.length > 0) {
                    clearInterval(timer);
                    setTimeout(() => {
                        try {
                            executeEvaluationInIframe(subWin, doc, gotoNext);
                        } catch (err) {
                            console.error("❌ 填充表单时发生错误：", err);
                            gotoNext();
                        }
                    }, DELAY_MS);
                }
            } catch (e) {
                // 忽略加载及跨域报错
            }
        }, 500);
    }

    // === 4. 自动填充与手动提交监听 ===
    function executeEvaluationInIframe(subWin, doc, gotoNext) {
        const subRadios = doc.querySelectorAll('input[type="radio"]');
        const groups = {};
        subRadios.forEach(radio => {
            const name = radio.name;
            if (!groups[name]) groups[name] = [];
            groups[name].push(radio);
        });

        let filled = 0;
        for (const name in groups) {
            const options = groups[name];
            
            // 是否最爱课程
            if (name === "sfzxhkc") {
                if (favoriteCount < 3) {
                    const yesOpt = options.find(opt => opt.value === "1");
                    if (yesOpt) {
                        yesOpt.click();
                        favoriteCount++;
                        filled++;
                        console.log(`%c  ★ 已自动将本课程标记为最喜爱的课程 (第 ${favoriteCount} 个名额)`, "color: #FF8C00;");
                    }
                } else {
                    const noOpt = options.find(opt => opt.value === "0");
                    if (noOpt) {
                        noOpt.click();
                        filled++;
                    }
                }
                continue;
            }
            
            if (name.startsWith("pj0601id_")) {
                const rand = Math.random() * 100;
                if (rand < EXCELLENT_RATE) {
                    if (options[0]) { options[0].click(); filled++; }
                } else {
                    if (options[1]) { options[1].click(); filled++; }
                    else if (options[0]) { options[0].click(); filled++; }
                }
            }
        }

        const textarea = doc.getElementById("jynr") || doc.getElementsByName("jynr")[0];
        if (textarea) {
            const randomComment = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
            textarea.value = randomComment;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }

        console.log(`%c  ✔ [%c${currentIndex + 1}/${queue.length}%c] 填充成功。请在网页下方手动点击[提交]！`, "color: #555;", "color: green; font-weight: bold;", "color: #555;");

        // 监听提交动作：由于用户自己手动点击，Chrome 100% 允许弹出保存成功/确认弹窗，绝不打断！
        // 脚本轮询检测子页面的变化，一旦检测到提交成功（发生跳转或内容变更），自动加载下一个老师。
        let checkSuccess = setInterval(() => {
            try {
                if (doc.title.includes("成功") || doc.body.innerText.includes("成功")) {
                    clearInterval(checkSuccess);
                    console.log(`%c  ✔ [%c${currentIndex + 1}/${queue.length}%c] 手动提交成功！载入下一位老师...`, "color: #555;", "color: green; font-weight: bold;", "color: #555;");
                    gotoNext();
                }
            } catch (e) {
                // 提交后跨域跳转，代表成功
                clearInterval(checkSuccess);
                console.log(`%c  ✔ [%c${currentIndex + 1}/${queue.length}%c] 手动提交成功！载入下一位老师...`, "color: #555;", "color: green; font-weight: bold;", "color: #555;");
                gotoNext();
            }
        }, 300);
    }

    processNext();
})();
