#!/usr/bin/env python3
"""
LIMINAL ATMOSPHERE — Threshold Studies
4-concept exploration plate for portfolio hero→About transition.
"""
import math
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

random.seed(107)  # highest score

FONTS_DIR = Path("/Users/dharmavyas/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/115884cc-9086-466b-bc01-489b43e45b37/ddc5ebaf-0a63-48ca-9c22-8adee9fc03b0/skills/canvas-design/canvas-fonts")
OUTPUT = Path("/Users/dharmavyas/Projects/Personal Portfolio/design")

SCALE = 2
W, H = 2400 * SCALE, 1600 * SCALE

BG     = (8, 9, 16)
GOLD   = (201, 163, 94)
BONE   = (244, 241, 234)
NAVY   = (13, 17, 38)
DIM    = (120, 115, 100)

# ── Fonts ─────────────────────────────────────────────────────────────────────
def load(name, size):
    path = FONTS_DIR / name
    return ImageFont.truetype(str(path), size * SCALE)

try:
    f_title   = load("PoiretOne-Regular.ttf",     44)
    f_label   = load("DMMono-Regular.ttf",         16)
    f_sub     = load("WorkSans-Regular.ttf",        13)
    f_sub_i   = load("WorkSans-Italic.ttf",         13)
    f_fig     = load("IBMPlexSerif-Regular.ttf",    11)
except Exception as e:
    print("Font error:", e)
    f_title = f_label = f_sub = f_sub_i = f_fig = ImageFont.load_default()


# ── Helpers ────────────────────────────────────────────────────────────────────
def cx_text(draw, text, font, y, color, img_w=None):
    iw = img_w or W
    bb = draw.textbbox((0,0), text, font=font)
    x = (iw - (bb[2]-bb[0])) // 2
    draw.text((x, y), text, fill=color, font=font)
    return bb[3] - bb[1]

def scatter_stars(draw, x1, y1, x2, y2, n=110, seed_offset=0):
    rng = random.Random(seed_offset * 999 + 17)
    for _ in range(n):
        x = rng.randint(x1+2, x2-2)
        y = rng.randint(y1+2, y2-2)
        br = rng.randint(110, 240)
        t = rng.random()
        if t < 0.12:
            col = (int(br*.9), int(br*.85), int(br*.65))
        elif t < 0.22:
            col = (int(br*.75), int(br*.8), br)
        else:
            col = (br, br, br)
        r = rng.uniform(.3, 1.5) * SCALE
        draw.ellipse([x-r, y-r, x+r, y+r], fill=col)

def corner_marks(draw, px1, py1, px2, py2, col=(201,163,94,35)):
    L = int(14 * SCALE)
    T = max(1, SCALE)
    corners = [
        (px1, py1,  1,  1),
        (px2, py1, -1,  1),
        (px1, py2,  1, -1),
        (px2, py2, -1, -1),
    ]
    for cx2, cy2, sx, sy in corners:
        draw.line([(cx2, cy2), (cx2+sx*L, cy2)], fill=col, width=T)
        draw.line([(cx2, cy2), (cx2, cy2+sy*L)], fill=col, width=T)


# ── Main canvas ────────────────────────────────────────────────────────────────
canvas = Image.new("RGBA", (W, H), (*BG, 255))
draw   = ImageDraw.Draw(canvas)

# Global star field (sparse)
scatter_stars(draw, 0, 0, W, H, n=600, seed_offset=0)

# Top + bottom rules
RM = 110 * SCALE
draw.line([(RM, 32*SCALE), (W-RM, 32*SCALE)], fill=(*GOLD, 38), width=1)
draw.line([(RM, H-58*SCALE), (W-RM, H-58*SCALE)], fill=(*GOLD, 38), width=1)

# ── Header ────────────────────────────────────────────────────────────────────
HEADER_Y = 52 * SCALE
h = cx_text(draw, "LIMINAL  ATMOSPHERE", f_title, HEADER_Y, GOLD)
sep_y = HEADER_Y + h + 14*SCALE
draw.line([(W//2 - 220*SCALE, sep_y), (W//2 + 220*SCALE, sep_y)], fill=(*GOLD,35), width=1)
cx_text(draw, "threshold studies  ·  hero → about transition concepts  ·  2025",
        f_label, sep_y + 16*SCALE, (*DIM, 160))

# ── Panel layout ──────────────────────────────────────────────────────────────
PTOP  = 180 * SCALE
PBOT  = 70  * SCALE   # room for labels
GAP_X = 72  * SCALE
GAP_Y = 90  * SCALE
PX    = RM
PW    = (W - PX*2 - GAP_X) // 2
PH    = (H - PTOP - PBOT*2 - GAP_Y) // 2

panels = [
    (PX,        PTOP,          PX + PW,        PTOP + PH),
    (PX+PW+GAP_X, PTOP,       PX+PW+GAP_X+PW, PTOP + PH),
    (PX,        PTOP+PH+GAP_Y, PX + PW,        PTOP+PH+GAP_Y+PH),
    (PX+PW+GAP_X, PTOP+PH+GAP_Y, PX+PW+GAP_X+PW, PTOP+PH+GAP_Y+PH),
]

panel_meta = [
    ("A — Aurora Veil",      "sinuous curtains of light · alive · no hard edge"),
    ("B — Orbital Limb",     "planetary arc · atmospheric halo · elliptical"),
    ("C — Nebula Scatter",   "three staggered focal glows · constellation-like"),
    ("D — Ascendant Ray",    "single off-centre column · cinematic · minimal"),
]


# ── Panel background ──────────────────────────────────────────────────────────
def panel_bg(px1, py1, px2, py2, idx):
    pw, ph = px2-px1, py2-py1
    bg_img = Image.new("RGBA", (pw, ph), (*BG, 255))
    ImageDraw.Draw(bg_img).rectangle([0,0,pw-1,ph-1], outline=(*GOLD,22), width=1)
    canvas.alpha_composite(bg_img, (px1, py1))
    scatter_stars(draw, px1+3, py1+3, px2-3, py2-3, n=90, seed_offset=idx+1)


# ─────────────────────────────────────────────────────────────────────────────
# CONCEPT A — Aurora Veil
# Sinuous vertical curtains (sine-warped vertical columns) of warm gold + cool blue
# ─────────────────────────────────────────────────────────────────────────────
def render_aurora(px1, py1, px2, py2):
    panel_bg(px1, py1, px2, py2, 0)
    pw, ph = px2-px1, py2-py1
    mid_y  = py1 + ph // 2

    overlay = Image.new("RGBA", (W, H), (0,0,0,0))
    od = ImageDraw.Draw(overlay)

    cols_data = [
        (0.12, (180, 140, 60), 14, 0.0,  0.55, 26),
        (0.25, (201, 163, 94), 18, 0.9,  0.70, 22),
        (0.38, (140, 170, 220), 12, 1.8, 0.45, 20),
        (0.52, (201, 163, 94), 20, 2.7,  0.80, 28),
        (0.65, (160, 130, 70), 13, 3.6,  0.50, 18),
        (0.78, (120, 150, 210), 10, 4.5, 0.40, 16),
        (0.90, (201, 163, 94), 16, 5.4,  0.65, 24),
    ]

    for (frac, col, amp_s, phase, alpha_k, width_s) in cols_data:
        x_base = px1 + int(pw * frac)
        amp    = amp_s * SCALE
        width  = int(width_s * SCALE)

        pts = []
        step = max(1, int(SCALE))
        for y in range(py1, py2, step):
            rel = (y - py1) / ph
            x   = x_base + amp * math.sin(rel * math.pi * 3.5 + phase)
            pts.append((x, y))

        for j in range(len(pts)-1):
            x0, y0 = pts[j]
            x1a, y1a = pts[j+1]
            rel = abs((y0 + y1a)/2 - mid_y) / (ph/2)
            alpha = max(0, int(200 * alpha_k * (1 - rel**1.4)))
            od.line([(x0, y0), (x1a, y1a)], fill=(*col, alpha), width=width)

    blurred = overlay.filter(ImageFilter.GaussianBlur(radius=20*SCALE))
    canvas.alpha_composite(blurred, (0, 0))

    # faint centre suggestion
    draw.line([(px1, mid_y), (px2, mid_y)], fill=(*GOLD, 12), width=1)
    corner_marks(draw, px1, py1, px2, py2)


# ─────────────────────────────────────────────────────────────────────────────
# CONCEPT B — Orbital Limb
# Curved arc suggesting a planetary horizon with warm atmosphere below
# ─────────────────────────────────────────────────────────────────────────────
def render_orbital(px1, py1, px2, py2):
    panel_bg(px1, py1, px2, py2, 1)
    pw, ph = px2-px1, py2-py1
    mid_y  = py1 + ph // 2

    # Ellipse: very wide, centred below the panel midpoint so only the upper arc shows
    ERX = pw * 0.68
    ERY = ph * 0.52
    ECX = px1 + pw // 2
    ECY = mid_y + int(ERY * 0.25)

    overlay = Image.new("RGBA", (W, H), (0,0,0,0))
    od = ImageDraw.Draw(overlay)

    # Atmospheric glow — stack of arcs with increasing bleed
    for layer in range(10):
        expand = layer * 5 * SCALE
        t = layer / 10
        # Gold core → cool blue atmosphere
        col = (
            int(201 * (1-t) + 70  * t),
            int(163 * (1-t) + 110 * t),
            int(94  * (1-t) + 210 * t),
        )
        alpha = max(0, int(110 - layer * 10))
        lw    = max(2, int((10 - layer*0.8) * SCALE))
        bbox  = [ECX - ERX - expand, ECY - ERY - expand,
                 ECX + ERX + expand, ECY + ERY + expand]
        od.arc(bbox, start=198, end=342, fill=(*col, alpha), width=lw)

    # Soft atmospheric fill below arc (gradient strip)
    atm = Image.new("RGBA", (W, H), (0,0,0,0))
    atmd = ImageDraw.Draw(atm)
    for strip in range(int(ph * 0.35)):
        t = strip / (ph * 0.35)
        alpha_s = max(0, int(55 * (1 - t**0.7)))
        col_s = (int(201*(1-t)+13*t), int(163*(1-t)+17*t), int(94*(1-t)+38*t))
        y_strip = mid_y + strip
        if y_strip < py2:
            atmd.line([(px1, y_strip), (px2, y_strip)], fill=(*col_s, alpha_s), width=1)

    atm_blurred = atm.filter(ImageFilter.GaussianBlur(radius=12*SCALE))
    overlay_blurred = overlay.filter(ImageFilter.GaussianBlur(radius=8*SCALE))

    canvas.alpha_composite(atm_blurred, (0, 0))
    canvas.alpha_composite(overlay_blurred, (0, 0))

    # Crisp bright arc on top
    crisp = Image.new("RGBA", (W, H), (0,0,0,0))
    cd = ImageDraw.Draw(crisp)
    cd.arc([ECX-ERX, ECY-ERY, ECX+ERX, ECY+ERY],
           start=202, end=338, fill=(*GOLD, 220), width=int(2*SCALE))
    crisp_b = crisp.filter(ImageFilter.GaussianBlur(radius=2*SCALE))
    canvas.alpha_composite(crisp_b, (0, 0))

    corner_marks(draw, px1, py1, px2, py2)


# ─────────────────────────────────────────────────────────────────────────────
# CONCEPT C — Nebula Scatter
# Three staggered focal glows: warm amber / gold / cool blue
# ─────────────────────────────────────────────────────────────────────────────
def render_nebula(px1, py1, px2, py2):
    panel_bg(px1, py1, px2, py2, 2)
    pw, ph = px2-px1, py2-py1
    mid_y  = py1 + ph // 2

    overlay = Image.new("RGBA", (W, H), (0,0,0,0))
    od = ImageDraw.Draw(overlay)

    foci = [
        (px1 + pw*0.20, mid_y - 18*SCALE, (180, 135, 55), 95,  80*SCALE, 55*SCALE),
        (px1 + pw*0.54, mid_y + 22*SCALE, (201, 163, 94), 140, 110*SCALE, 70*SCALE),
        (px1 + pw*0.83, mid_y - 35*SCALE, (90, 125, 205), 70,   72*SCALE, 48*SCALE),
    ]

    for (fx, fy, col, max_a, rx, ry) in foci:
        for layer in range(8):
            t = layer / 8
            ex = rx * (1 - t*0.15)
            ey = ry * (1 - t*0.15)
            alpha = max(0, int(max_a * (1 - t**0.6)))
            od.ellipse([fx-ex, fy-ey, fx+ex, fy+ey], fill=(*col, alpha))

    blurred = overlay.filter(ImageFilter.GaussianBlur(radius=26*SCALE))
    canvas.alpha_composite(blurred, (0, 0))

    # Very subtle horizontal mist at seam
    mist = Image.new("RGBA", (W, H), (0,0,0,0))
    md = ImageDraw.Draw(mist)
    for y_off in range(-10, 11):
        y = mid_y + y_off * SCALE
        a = max(0, int(20 - abs(y_off)*2))
        md.line([(px1, y), (px2, y)], fill=(*GOLD, a), width=1)
    mist_b = mist.filter(ImageFilter.GaussianBlur(radius=6*SCALE))
    canvas.alpha_composite(mist_b, (0, 0))

    corner_marks(draw, px1, py1, px2, py2)


# ─────────────────────────────────────────────────────────────────────────────
# CONCEPT D — Ascendant Ray
# Single off-centre vertical column of light, widening at base
# ─────────────────────────────────────────────────────────────────────────────
def render_ascendant(px1, py1, px2, py2):
    panel_bg(px1, py1, px2, py2, 3)
    pw, ph = px2-px1, py2-py1
    mid_y  = py1 + ph // 2
    # Offset slightly right of centre for asymmetric tension
    rcx   = px1 + int(pw * 0.56)

    overlay = Image.new("RGBA", (W, H), (0,0,0,0))

    for layer in range(7):
        ray = Image.new("RGBA", (W, H), (0,0,0,0))
        rd  = ImageDraw.Draw(ray)
        t   = layer / 7
        col = (
            int(201*(1-t) + 100*t),
            int(163*(1-t) + 140*t),
            int(94 *(1-t) + 220*t),
        )
        base_w = int((70 - layer*8) * SCALE)
        if base_w <= 1:
            continue
        base_alpha = int(100 - layer * 12)

        # Upward taper
        for y in range(py1, mid_y+1):
            dist_up = (mid_y - y) / max(1, mid_y - py1)
            w = max(1, int(base_w * (1 - dist_up * 0.75)))
            a = max(0, int(base_alpha * (1 - dist_up**1.2)))
            rd.rectangle([rcx-w, y, rcx+w, y+SCALE], fill=(*col, a))

        # Downward splay
        for y in range(mid_y, py2):
            dist_dn = (y - mid_y) / max(1, py2 - mid_y)
            w = int(base_w * (1 + dist_dn * 2.2))
            a = max(0, int(base_alpha * (1 - dist_dn**0.75)))
            rd.rectangle([rcx-w, y, rcx+w, y+SCALE], fill=(*col, a))

        blr = ray.filter(ImageFilter.GaussianBlur(radius=int((18-layer*2)*SCALE)))
        canvas.alpha_composite(blr, (0, 0))

    # Bright core filament
    core = Image.new("RGBA", (W, H), (0,0,0,0))
    cd   = ImageDraw.Draw(core)
    for y in range(py1 + int(ph*0.05), mid_y + int(ph*0.3)):
        rel = abs(y - (py1+py2)//2) / (ph*0.45)
        a   = max(0, int(200 * (1 - rel**1.5)))
        cd.line([(rcx-SCALE, y), (rcx+SCALE, y)], fill=(240, 222, 165, a), width=int(2*SCALE))
    canvas.alpha_composite(core.filter(ImageFilter.GaussianBlur(radius=3*SCALE)), (0, 0))

    corner_marks(draw, px1, py1, px2, py2)


# ── Render panels ──────────────────────────────────────────────────────────────
render_aurora(   *panels[0])
render_orbital(  *panels[1])
render_nebula(   *panels[2])
render_ascendant(*panels[3])

draw = ImageDraw.Draw(canvas)   # refresh after compositing

# ── Panel labels ───────────────────────────────────────────────────────────────
for i, (px1, py1, px2, py2) in enumerate(panels):
    name, desc = panel_meta[i]
    lbl_y = py2 + 18*SCALE
    bb = draw.textbbox((0,0), name, font=f_label)
    lx = (px1+px2)//2 - (bb[2]-bb[0])//2
    draw.text((lx, lbl_y), name, fill=GOLD, font=f_label)

    bb2 = draw.textbbox((0,0), desc, font=f_sub_i)
    dx  = (px1+px2)//2 - (bb2[2]-bb2[0])//2
    draw.text((dx, lbl_y + (bb[3]-bb[1]) + 7*SCALE), desc, fill=(*DIM, 165), font=f_sub_i)

# ── Footer ─────────────────────────────────────────────────────────────────────
footer = "DHARMA VYAS   ·   LIMINAL ATMOSPHERE   ·   HERO → ABOUT   ·   Fig. 05   ·   2025"
bb = draw.textbbox((0,0), footer, font=f_fig)
fx = (W - (bb[2]-bb[0])) // 2
draw.text((fx, H - 45*SCALE), footer, fill=(*DIM, 110), font=f_fig)

# ── Export ─────────────────────────────────────────────────────────────────────
out_path = OUTPUT / "LIMINAL-ATMOSPHERE.png"
final = canvas.convert("RGB").resize((W//SCALE, H//SCALE), Image.LANCZOS)
final.save(str(out_path), "PNG", dpi=(300,300))
print(f"✓  Saved → {out_path}")
