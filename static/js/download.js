(function () {
  'use strict';

  const releases = window.BOR_RELEASES;

  const ARCH_NORMALIZE = { amd64: 'x86_64', arm64: 'aarch64', ppc64el: 'ppc64le' };
  const ARCH_ORDER = ['x86_64', 'aarch64', 'ppc64le'];

  const FORMAT_META = {
    deb:  { label: 'Debian / Ubuntu',      ext: '.deb',         color: 'is-info' },
    rpm:  { label: 'RHEL / Fedora / SUSE', ext: '.rpm',         color: 'is-danger' },
    apk:  { label: 'Alpine Linux',         ext: '.apk',         color: 'is-success' },
    arch: { label: 'Arch Linux',           ext: '.pkg.tar.zst', color: 'is-warning' },
  };
  const FORMAT_ORDER = ['deb', 'rpm', 'apk', 'arch'];

  let selectedTag = null;
  let selectedComponent = 'server';

  function parseAsset(asset) {
    const { name, browser_download_url: url } = asset;

    const component = name.startsWith('bor-server') ? 'server'
                    : name.startsWith('bor-agent')  ? 'agent'
                    : null;
    if (!component) return null;

    const format = name.endsWith('.deb')         ? 'deb'
                 : name.endsWith('.rpm')         ? 'rpm'
                 : name.endsWith('.apk')         ? 'apk'
                 : name.endsWith('.pkg.tar.zst') ? 'arch'
                 : null;
    if (!format) return null;

    const rawArch = ['x86_64', 'aarch64', 'ppc64le', 'amd64', 'arm64', 'ppc64el']
      .find(a => name.includes(a));
    if (!rawArch) return null;
    const arch = ARCH_NORMALIZE[rawArch] ?? rawArch;

    return { component, format, arch, url, filename: name };
  }

  function renderCards(tag, component) {
    const rel = releases.find(r => r.tag_name === tag);
    if (!rel) return;

    const parsed = rel.assets.map(parseAsset).filter(a => a && a.component === component);

    const byFormat = {};
    for (const a of parsed) {
      (byFormat[a.format] = byFormat[a.format] || []).push(a);
    }
    for (const f of Object.keys(byFormat)) {
      byFormat[f].sort((a, b) => ARCH_ORDER.indexOf(a.arch) - ARCH_ORDER.indexOf(b.arch));
    }

    const grid = document.getElementById('dl-grid');
    grid.innerHTML = '';

    for (const f of FORMAT_ORDER) {
      if (!byFormat[f]) continue;
      const { label, ext, color } = FORMAT_META[f];
      const btns = byFormat[f]
        .map(({ arch, url, filename }) =>
          `<a href="${url}" class="button is-small is-outlined ${color}" title="${filename}">${arch}</a>`)
        .join('');

      grid.insertAdjacentHTML('beforeend',
        `<div class="column is-6">
           <div class="card dl-pkg-card">
             <div class="card-content">
               <p class="dl-pkg-name">${label} <span class="tag is-light">${ext}</span></p>
               <div class="buttons mt-2">${btns}</div>
             </div>
           </div>
         </div>`
      );
    }

    // Source archive — not component-specific, always shown
    const tarUrl = `https://github.com/VuteTech/bor/archive/refs/tags/${tag}.tar.gz`;
    const zipUrl = `https://github.com/VuteTech/bor/archive/refs/tags/${tag}.zip`;
    grid.insertAdjacentHTML('beforeend',
      `<div class="column is-6">
         <div class="card dl-pkg-card">
           <div class="card-content">
             <p class="dl-pkg-name">Source Archive <span class="tag is-light">build from source</span></p>
             <div class="buttons mt-2">
               <a href="${tarUrl}" class="button is-small is-outlined is-dark">.tar.gz</a>
               <a href="${zipUrl}" class="button is-small is-outlined is-dark">.zip</a>
             </div>
           </div>
         </div>
       </div>`
    );

    document.getElementById('dl-step-packages').style.display = '';
  }

  function init() {
    const releaseSelect = document.getElementById('dl-release');
    const stepComponent = document.getElementById('dl-step-component');
    const stepPackages  = document.getElementById('dl-step-packages');
    const componentTabs = document.getElementById('dl-component-tabs');

    const latestStable = releases.find(r => !r.draft && !r.prerelease);

    for (const rel of releases) {
      if (rel.draft) continue;
      const suffix = rel === latestStable ? ' (latest)' : rel.prerelease ? ' (pre-release)' : '';
      const opt = document.createElement('option');
      opt.value = rel.tag_name;
      opt.textContent = rel.tag_name + suffix;
      releaseSelect.appendChild(opt);
    }

    releaseSelect.addEventListener('change', () => {
      selectedTag = releaseSelect.value || null;
      if (selectedTag) {
        stepComponent.style.display = '';
        renderCards(selectedTag, selectedComponent);
      } else {
        stepComponent.style.display = 'none';
        stepPackages.style.display  = 'none';
      }
    });

    componentTabs.addEventListener('click', e => {
      const link = e.target.closest('[data-value]');
      if (!link) return;
      selectedComponent = link.dataset.value;
      componentTabs.querySelectorAll('li').forEach(li => li.classList.remove('is-active'));
      link.closest('li').classList.add('is-active');
      if (selectedTag) renderCards(selectedTag, selectedComponent);
    });

    // Auto-select latest stable
    if (latestStable) {
      releaseSelect.value = latestStable.tag_name;
      releaseSelect.dispatchEvent(new Event('change'));
    }
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
}());
