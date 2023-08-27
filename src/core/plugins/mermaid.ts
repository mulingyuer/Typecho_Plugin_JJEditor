/*
 * @Author: mulingyuer
 * @Date: 2023-08-27 15:13:31
 * @LastEditTime: 2023-08-27 22:38:23
 * @LastEditors: mulingyuer
 * @Description: mermaid
 * @FilePath: /Typecho_Plugin_JJEditor/src/core/plugins/mermaid.ts
 * 怎么可能会有bug！！！
 */
// @ts-nocheck

const icons = {
	ChartGraph:
		'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48"><path stroke="currentColor" stroke-linejoin="round" stroke-width="4" d="M17 6h14v9H17zM6 33h14v9H6zM28 33h14v9H28z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M24 16v8M13 33v-9h22v9"/></svg>'
};
const er = "Entity relationship diagram";
const flowchart = "Flow chart";
const gantt = "Gantt chart";
const mermaid$1 = "Mermaid diagrams";
const mindmap = "Mindmaps";
const pie = "Pie chart";
const sequence = "Sequence diagram";
const state = "State diagram";
const timeline = "Timeline";
const uj = "User journey diagram";
const en = {
	class: "Class diagram",
	er,
	flowchart,
	gantt,
	mermaid: mermaid$1,
	mindmap,
	pie,
	sequence,
	state,
	timeline,
	uj
};
export default function mermaid({ locale: _locale, ...mermaidConfig } = {}) {
	const locale = { ...en, ..._locale };
	let m = window.mermaid;
	const actionItems = [
		{
			title: locale.flowchart,
			code: `graph TD
Start --> Stop`
		},
		{
			title: locale.sequence,
			code: `sequenceDiagram
Alice->>John: Hello John, how are you?
John-->>Alice: Great!
Alice-)John: See you later!`
		},
		{
			title: locale.class,
			code: `classDiagram
Animal <|-- Duck
Animal <|-- Fish
Animal <|-- Zebra
Animal : +int age
Animal : +String gender
Animal: +isMammal()
Animal: +mate()
class Duck{
+String beakColor
+swim()
+quack()
}
class Fish{
-int sizeInFeet
-canEat()
}
class Zebra{
+bool is_wild
+run()
}`
		},
		{
			title: locale.state,
			code: `stateDiagram-v2
[*] --> Still
Still --> [*]

Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]`
		},
		{
			title: locale.er,
			code: `erDiagram
CUSTOMER ||--o{ ORDER : places
ORDER ||--|{ LINE-ITEM : contains
CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`
		},
		{
			title: locale.uj,
			code: `journey
title My working day
section Go to work
Make tea: 5: Me
Go upstairs: 3: Me
Do work: 1: Me, Cat
section Go home
Go downstairs: 5: Me
Sit down: 5: Me`
		},
		{
			title: locale.gantt,
			code: `gantt
title A Gantt Diagram
dateFormat  YYYY-MM-DD
section Section
A task           :a1, 2014-01-01, 30d
Another task     :after a1  , 20d
section Another
Task in sec      :2014-01-12  , 12d
another task      : 24d`
		},
		{
			title: locale.pie,
			code: `pie title Pets adopted by volunteers
"Dogs" : 386
"Cats" : 85
"Rats" : 15`
		},
		{
			title: locale.mindmap,
			code: `mindmap
      Root
          A
            B
            C
    `
		},
		{
			title: locale.timeline,
			code: `timeline
      title History of Social Media Platform
      2002 : LinkedIn
      2004 : Facebook
           : Google
      2005 : Youtube
      2006 : Twitter
      `
		}
	];
	return {
		viewerEffect({ markdownBody }) {
			(async () => {
				const els = markdownBody.querySelectorAll("pre>code.language-mermaid");
				if (els.length === 0) return;
				if (!m) {
					m = await import("mermaid").then((c) => c.default);
					if (mermaidConfig) {
						m.initialize(mermaidConfig);
					}
				}
				els.forEach((el, i) => {
					const pre = el.parentElement;
					const source = el.innerText;
					const container = document.createElement("div");
					container.classList.add("bytemd-mermaid");
					container.style.lineHeight = "initial";
					pre.replaceWith(container);
					m.render(
						`bytemd-mermaid-${Date.now()}-${i}`,
						source,
						// @ts-ignore
						container
					)
						.then((svgCode) => {
							container.innerHTML = svgCode.svg;
						})
						.catch((err) => {});
				});
			})();
		},
		actions: [
			{
				title: locale.mermaid,
				icon: icons.ChartGraph,
				cheatsheet: "```mermaid",
				handler: {
					type: "dropdown",
					actions: actionItems.map(({ title, code }) => ({
						title,
						handler: {
							type: "action",
							click({ editor, appendBlock, codemirror }) {
								const { line } = appendBlock("```mermaid\n" + code + "\n```");
								editor.setSelection(codemirror.Pos(line + 1, 0), codemirror.Pos(line + code.split("\n").length));
								editor.focus();
							}
						}
					})),
					...locale
				}
			}
		]
	};
}
