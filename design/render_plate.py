#!/usr/bin/env python3
"""LUMEN OBSCURA — museum observation plate. Rendered with PIL, supersampled."""
import math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONT_DIR = "/Users/dharmavyas/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/115884cc-9086-466b-bc01-489b43e45b37/ddc5ebaf-0a63-48ca-9c22-8adee9fc03b0/skills/canvas-design/canvas-fonts"
OUT = "/Users/dharmavyas/Projects/Personal Portfolio/design/LUMEN-OBSCURA.png"

SS = 2                      # supersample factor
W, H = 1600, 2240          # final size
w, h = W * SS, H * SS
M = 130 * SS               # margin

INK   = (10, 10, 11)
NAVY  = (12, 16, 36)
BONE  = (244, 241, 234)
GOLD  = (201, 163, 94)
BLUEW = (176, 190, 236)

def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", int(size * SS))

# ---------------------------------------------------------------- base canvas
img = Image.new("RGB", (w, h), INK)
px = img.load()
# vertical gradient: deep night at top -> ink mid -> faintest warmth low
for y in range(h):
    t = y / h
    if t < 0.5:
        k = t / 0.5
        c = tuple(int(NAVY[i] + (INK[i] - NAVY[i]) * k) for i in range(3))
    else:
        c = INK
    for x in range(w):
        px[x, y] = c
draw = ImageDraw.Draw(img, "RGBA")

# whisper coordinate grid — systematic chart language, barely there
GM = int(95 * SS)
for i in range(1, 6):
    gx = GM + (w - 2*GM) * i / 6
    for yy in range(GM, h - GM, 11 * SS):
        draw.point((gx, yy), fill=BONE + (16,))
for i in range(1, 8):
    gy = GM + (h - 2*GM) * i / 8
    for xx in range(GM, w - GM, 11 * SS):
        draw.point((xx, gy), fill=BONE + (16,))

def glow(cx, cy, rx, ry, color, alpha, blur):
    """Soft radial bloom via a blurred filled ellipse on its own layer."""
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    img.paste(layer, (0, 0), layer)

# ---------------------------------------------------------------- horizon glow
HORIZON = int(h * 0.74)
glow(w // 2, HORIZON, int(w * 0.40), int(h * 0.085), GOLD, 54, 92 * SS)
glow(w // 2, HORIZON, int(w * 0.58), int(h * 0.14), BLUEW, 15, 135 * SS)

# ---------------------------------------------------------------- star field
random.seed(107)
stars = Image.new("RGBA", (w, h), (0, 0, 0, 0))
sd = ImageDraw.Draw(stars)
for _ in range(1300):
    x = random.uniform(0, w)
    # bias density toward the upper sky, thin out near horizon
    y = random.uniform(0, HORIZON + 40 * SS) ** 1.0
    y = random.uniform(0, 1) ** 1.3 * (HORIZON - M * 0.2) + M * 0.2
    r = random.uniform(0.5, 2.3) * SS * random.random()
    roll = random.random()
    col = GOLD if roll < 0.12 else (BLUEW if roll < 0.4 else BONE)
    a = int(random.uniform(40, 150))
    sd.ellipse([x - r, y - r, x + r, y + r], fill=col + (a,))
img.paste(stars, (0, 0), stars)

# a few hero stars with a faint 4-point sparkle
def sparkle(cx, cy, ln, a):
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.line([cx - ln, cy, cx + ln, cy], fill=BONE + (a,), width=SS)
    d.line([cx, cy - ln, cx, cy + ln], fill=BONE + (a,), width=SS)
    d.ellipse([cx - 2*SS, cy - 2*SS, cx + 2*SS, cy + 2*SS], fill=BONE + (220,))
    layer = layer.filter(ImageFilter.GaussianBlur(1.2 * SS))
    img.paste(layer, (0, 0), layer)
for (sx, sy, sl) in [(0.30, 0.26, 26), (0.72, 0.20, 20), (0.58, 0.40, 16), (0.84, 0.50, 14)]:
    sparkle(int(w*sx), int(h*sy), int(sl*SS), 150)

# ---------------------------------------------------------------- trajectory arc
# origin near lower-left (the crease), apex high, descending to the right.
ox, oy = int(w * 0.20), int(h * 0.70)
apex_x, apex_y = int(w * 0.55), int(h * 0.235)
ex, ey = int(w * 0.86), int(h * 0.40)

def bezier(p0, p1, p2, n=400):
    pts = []
    for i in range(n + 1):
        t = i / n
        mt = 1 - t
        x = mt*mt*p0[0] + 2*mt*t*p1[0] + t*t*p2[0]
        y = mt*mt*p0[1] + 2*mt*t*p1[1] + t*t*p2[1]
        pts.append((x, y))
    return pts
# control point pulls the curve into a clean ballistic parabola
ctrl = (apex_x, apex_y - int(h * 0.06))
arc = bezier((ox, oy), ctrl, (ex, ey), 500)

# glow underlay
glow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow_layer)
gd.line(arc, fill=GOLD + (180,), width=10 * SS, joint="curve")
glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(11 * SS))
img.paste(glow_layer, (0, 0), glow_layer)

# crisp arc with alpha fade at the ends (brightest near the apex)
arc_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
ad = ImageDraw.Draw(arc_layer)
N = len(arc)
for i in range(N - 1):
    t = i / (N - 1)
    fade = math.sin(min(1, max(0, (t - 0.0) / 1.0)) * math.pi)   # 0 ends,1 mid
    a = int(60 + 195 * fade)
    ad.line([arc[i], arc[i+1]], fill=BONE + (a,), width=max(1, int(1.6 * SS)))
img.paste(arc_layer, (0, 0), arc_layer)

# the ball — luminous focal jewel at the apex
bx, by = apex_x, apex_y
glow(bx, by, 40 * SS, 40 * SS, GOLD, 120, 30 * SS)
glow(bx, by, 18 * SS, 18 * SS, GOLD, 170, 12 * SS)
glow(bx, by, 9 * SS, 9 * SS, BONE, 170, 5 * SS)
draw.ellipse([bx - 6.5*SS, by - 6.5*SS, bx + 6.5*SS, by + 6.5*SS], fill=GOLD + (255,))
draw.ellipse([bx - 2.6*SS, by - 3.6*SS, bx + 1.2*SS, by + 0.2*SS], fill=BONE + (255,))

# ---------------------------------------------------------------- clinical notation
fjura  = lambda s: font("Jura-Light.ttf", s)
fjuram = lambda s: font("Jura-Medium.ttf", s)

def spaced(draw, xy, text, fnt, fill, tracking, anchor="la"):
    # letter-spaced text; anchor 'la' left, 'ma' centered, 'ra' right
    widths = [draw.textlength(ch, font=fnt) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x, y = xy
    if anchor[0] == "m": x -= total / 2
    elif anchor[0] == "r": x -= total
    for ch, wd in zip(text, widths):
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += wd + tracking
    return total

dim_bone = BONE + (140,)
faint    = BONE + (70,)
goldfill = GOLD + (235,)

# fine keyline frame — formalizes the margin, contains the plate
FM = int(78 * SS)
draw.rectangle([FM, FM, w - FM, h - FM], outline=BONE + (40,), width=SS)

# baseline horizon axis with ticks + degree labels
axis_y = HORIZON
draw.line([M, axis_y, w - M, axis_y], fill=BONE + (45,), width=SS)
ticks = 12
for i in range(ticks + 1):
    tx = M + (w - 2*M) * i / ticks
    th = (10 if i % 3 == 0 else 5) * SS
    draw.line([tx, axis_y, tx, axis_y - th], fill=BONE + (70,), width=SS)
    if i % 3 == 0:
        spaced(draw, (tx, axis_y + 10*SS), f"{i*15:02d}", fjura(11), faint, 2*SS, "ma")

# left vertical scale
draw.line([M, M*1.7, M, axis_y], fill=BONE + (40,), width=SS)
for i in range(7):
    ty = M*1.7 + (axis_y - M*1.7) * i / 6
    draw.line([M, ty, M + 8*SS, ty], fill=BONE + (60,), width=SS)

# faint launch-angle arc at origin + dotted sightline to apex
draw.arc([ox - 70*SS, oy - 70*SS, ox + 70*SS, oy + 70*SS], 270, 318,
         fill=GOLD + (120,), width=SS)
def dotted(p0, p1, gap=14):
    d = math.dist(p0, p1); n = int(d / (gap*SS))
    for i in range(n+1):
        t = i/n; x = p0[0]+(p1[0]-p0[0])*t; y=p0[1]+(p1[1]-p0[1])*t
        draw.ellipse([x-SS, y-SS, x+SS, y+SS], fill=BONE+(70,))
dotted((ox, oy), (apex_x, apex_y))
dotted((apex_x, apex_y), (apex_x, axis_y))   # apex altitude drop

# small registration crosshairs in the corners
def cross(cx, cy, s=11):
    draw.line([cx - s*SS, cy, cx + s*SS, cy], fill=BONE+(90,), width=SS)
    draw.line([cx, cy - s*SS, cx, cy + s*SS], fill=BONE+(90,), width=SS)
for (cx, cy) in [(M, M), (w-M, M), (M, h-M), (w-M, h-M)]:
    cross(cx, cy)

# apex catalog reference — the quiet "107"
spaced(draw, (bx + 26*SS, by - 8*SS), "N° 107", fjuram(15), goldfill, 3*SS, "la")
spaced(draw, (bx + 26*SS, by + 14*SS), "APEX · NOT OUT", fjura(10.5), faint, 3*SS, "la")

# ---------------------------------------------------------------- top register
spaced(draw, (M, M - 4*SS), "OBSERVATORY PLATE", fjura(12), dim_bone, 6*SS, "la")
spaced(draw, (w - M, M - 4*SS), "MMXXVI · δ +107°", fjura(12), dim_bone, 5*SS, "ra")

# ---------------------------------------------------------------- title block (lower)
title = font("Italiana-Regular.ttf", 96)
spaced(draw, (w//2, int(h*0.80)), "LUMEN OBSCURA", title, BONE + (245,), 8*SS, "ma")
spaced(draw, (w//2, int(h*0.80) + 124*SS), "A STUDY IN LUMINOUS RESTRAINT", fjura(15),
       dim_bone, 7*SS, "ma")
# italic accent phrase
ital = font("InstrumentSerif-Italic.ttf", 40)
phrase = "patience,  intention,  craft."
pw = draw.textlength(phrase, font=ital)
draw.text((w//2 - pw/2, int(h*0.80) + 168*SS), phrase, font=ital, fill=GOLD + (200,))

# ---------------------------------------------------------------- bottom register
spaced(draw, (M, h - M - 2*SS), "PL. I", fjura(12), faint, 5*SS, "la")
spaced(draw, (w//2, h - M - 2*SS), "DV", font("Italiana-Regular.ttf", 18), dim_bone, 4*SS, "ma")
spaced(draw, (w - M, h - M - 2*SS), "TRAJECTORY — FIG. 107", fjura(12), faint, 4*SS, "ra")

# ---------------------------------------------------------------- finish
final = img.filter(ImageFilter.GaussianBlur(0.4)).resize((W, H), Image.LANCZOS)
final.save(OUT, "PNG")
print("saved", OUT)
