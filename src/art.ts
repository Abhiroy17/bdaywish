export function icon(name: 'heart' | 'arrow' | 'music' | 'star' | 'coffee' | 'replay'): string {
  const paths = {
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    music: '<path d="M9 18V5l12-2v13M9 8l12-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="16" rx="3" ry="3"/>',
    star: '<path d="m12 2 2.8 6.7L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-3.3Z"/>',
    coffee: '<path d="M4 9h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4ZM16 10h2a3 3 0 0 1 0 6h-2M7 2v3m6-3v3"/>',
    replay: '<path d="M3 10a9 9 0 1 1 1 8M3 3v7h7"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

export function sofa(): string {
  return `<svg class="sofa" viewBox="0 0 480 215" fill="none" aria-hidden="true">
    <ellipse cx="240" cy="194" rx="212" ry="15" fill="#45291c" opacity=".12"/>
    <path d="m73 174-5 25h15l8-25m298 0 5 25h-15l-8-25" fill="#69462e"/>
    <rect x="62" y="46" width="356" height="133" rx="40" fill="#a74f2e"/>
    <rect x="74" y="31" width="332" height="122" rx="40" fill="#c56b3e"/>
    <rect x="91" y="43" width="298" height="96" rx="29" fill="#d3844e" stroke="#e49b60" stroke-width="3"/>
    <path d="M191 47v82m99-82v82" stroke="#b9693d" stroke-width="2"/>
    <g fill="#b1683e"><circle cx="139" cy="83" r="4"/><circle cx="240" cy="83" r="4"/><circle cx="340" cy="83" r="4"/></g>
    <rect x="77" y="129" width="164" height="39" rx="16" fill="#e09659" stroke="#b9693d" stroke-width="2"/>
    <rect x="240" y="129" width="163" height="39" rx="16" fill="#e09659" stroke="#b9693d" stroke-width="2"/>
    <rect x="39" y="98" width="51" height="79" rx="23" fill="#bd6138"/>
    <ellipse cx="64.5" cy="108" rx="26" ry="20" fill="#e09659"/>
    <rect x="390" y="98" width="51" height="79" rx="23" fill="#bd6138"/>
    <ellipse cx="415.5" cy="108" rx="26" ry="20" fill="#e09659"/>
    <path d="M91 175h298" stroke="#ebaa6a" stroke-width="3"/>
    <rect x="105" y="96" width="56" height="42" rx="8" transform="rotate(-14 105 96)" fill="#f2dcac"/>
    <path d="m116 98 32 18m-29-23 32 18" stroke="#c5a16a" stroke-width="2"/>
    <rect x="324" y="86" width="51" height="49" rx="8" transform="rotate(12 324 86)" fill="#79856a"/>
    <path d="m340 99 15 18m-18-4 22-10" stroke="#aab195" stroke-width="2"/>
  </svg>`;
}

export function memoryArt(index: number): string {
  const drawings = [
    '<circle cx="78" cy="92" r="23" fill="#edd6c2"/><circle cx="162" cy="92" r="23" fill="#c5b4d7"/><path d="M63 75h25v28H63zM149 75h25v28h-25z" fill="#faf3e5"/><path d="M88 79c19-5 19 22 0 17m86-17c19-5 19 22 0 17" fill="none" stroke="#faf3e5" stroke-width="5"/><path d="M116 63q4-12 9 0 5-12 9 0t-9 15q-14-10-9-15" fill="#b88083"/>',
    '<circle cx="119" cy="79" r="37" fill="#ead5a3"/><path d="M0 133 76 73l57 60 37-31 70 57v41H0" fill="#9aab96"/><path d="m0 170 98-67 83 66 59-22v53H0" fill="#758d7c"/><path d="M105 41q7-7 14 0m12 10q7-7 14 0" stroke="#756959" fill="none" stroke-width="2"/>',
    '<path d="M39 150V50h162v100" stroke="#e0cdb1" stroke-width="9"/><path d="M120 50v100M39 98h162" stroke="#e0cdb1" stroke-width="5"/><path d="M57 150v-37h24v37m10 0V80h25v70m10 0v-24h25v24m9 0V98h25v52" fill="#a99abb"/><circle cx="174" cy="71" r="13" fill="#efcf91"/><path d="M20 163h200" stroke="#947b65" stroke-width="6"/>',
    '<path d="m82 140 34-65 45 66z" fill="#c7b4d8"/><path d="m69 147 44-18 54 19" fill="#e5c395"/><path d="m116 75 7-17 5 17" fill="#cc965e"/><path d="M108 114q9-20 17 0 10-20 17 0t-17 22q-26-18-17-22" fill="#faf4e9"/><g fill="#b99a65"><circle cx="64" cy="65" r="3"/><circle cx="176" cy="88" r="3"/><circle cx="63" cy="123" r="2"/><circle cx="162" cy="52" r="2"/></g>',
  ];
  return `<svg viewBox="0 0 240 200" aria-hidden="true">${drawings[index % drawings.length]}</svg>`;
}