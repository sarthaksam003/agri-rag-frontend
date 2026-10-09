import a from "@/assets/1.jpg"
import b from "@/assets/2.jpg"
import c from "@/assets/3.jpg"
import d from "@/assets/4.jpg"
import e from "@/assets/5.avif"
import f from "@/assets/6.avif"
import g from "@/assets/7.avif"
import h from "@/assets/8.avif"
import i from "@/assets/9.avif"

export const HERO_IMAGE_URLS = [
    a, b, c, d, e, f, g, h, i];

export function pickRandomHeroImage(): string {
    return HERO_IMAGE_URLS[
        Math.floor(Math.random() * HERO_IMAGE_URLS.length)
    ];
}