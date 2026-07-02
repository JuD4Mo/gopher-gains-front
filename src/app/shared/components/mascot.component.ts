import { Component, input } from '@angular/core';

export type MascotVariant = 'main' | 'thinking' | 'clipboard' | 'celebrating';

const MASCOT_URLS: Record<MascotVariant, string> = {
  main:       'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-Gains-Logo-v1-Photoroom-WfSlqGUxq90Xa0oAPjDPNoaGcCYtXQ.png',
  thinking:   'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-thinking-Photoroom-0gguwoJ79ANQ0MBK9mrnlwsQY4QLkK.png',
  clipboard:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gopher-clipboard-Photoroom-IsR5uV4PXCOFc4rG4gWb2fp9Og5EGF.png',
  celebrating:'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gopher-celebrating-BZF4N0dTYgz8RsFhJeLbyonFVV35Lx.png',
};

const SIZE_MAP: Record<string, string> = {
  xs:  'w-8 h-8',
  sm:  'w-12 h-12',
  md:  'w-20 h-20',
  lg:  'w-28 h-28',
  xl:  'w-36 h-36',
  '2xl': 'w-44 h-44',
  '3xl': 'w-56 h-56',
};

@Component({
  selector: 'app-mascot',
  standalone: true,
  template: `
    <img
      [src]="src()"
      [alt]="alt()"
      class="object-contain select-none pointer-events-none"
      [class]="sizeClass()"
      [style.aspect-ratio]="'1/1'"
      loading="lazy"
    />
  `,
})
export class MascotComponent {
  readonly variant = input<MascotVariant>('main');
  readonly size = input<string>('md');
  readonly alt = input('');

  protected readonly src = () => MASCOT_URLS[this.variant()];
  protected readonly sizeClass = () => SIZE_MAP[this.size()] ?? SIZE_MAP['md'];
}
