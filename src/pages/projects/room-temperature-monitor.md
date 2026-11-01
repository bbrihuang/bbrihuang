---
layout: ../../layouts/ProjectLayout.astro
title: Room Temperature Monitor
tag: Hardware
description: Built an Arduino temperature monitor that sounds an alarm outside 60 to 80°F and runs about 7.8 hours on a 9V battery, in a 3D-printed ABS case I designed.
year: "2026"
chips: ["Arduino UNO", "C++", "TMP36", "Onshape"]
github: https://github.com/bbrihuang/temperature-sensor
---

<img class="case-hero" src="/projects/room-temperature-monitor/hero.webp" alt="The finished temperature monitor: a black 3D-printed case with an LCD on top, a power switch, a green power LED, a USB port, a red alarm LED and a buzzer.">

<div class="stat-grid">
  <div class="stat"><strong>60 to 80°F</strong><span>normal range, alarm outside it</span></div>
  <div class="stat"><strong>70.3 mA</strong><span>total draw</span></div>
  <div class="stat"><strong>~7.8 h</strong><span>on a 550 mAh 9V battery</span></div>
  <div class="stat"><strong>160.5 × 117 × 57.4 mm</strong><span>ABS enclosure</span></div>
</div>

## The problem

A room that gets too hot or too cold is easy to miss until it matters. I wanted a small battery-powered device that watches the temperature on its own, shows it, and makes noise when it leaves a safe range.

## What I did

- Built a temperature alarm around an Arduino UNO and a TMP36 sensor that reads -40 to 257°F, showing the status on an LCD and sounding a buzzer when the room is too cold (under 60°F) or too hot (over 80°F).
- Sized the LED resistors with Kirchhoff's voltage law (220 Ω for the red LED at 13.6 mA, 1000 Ω for the green power LED at 3.0 mA), keeping the 9V battery's total draw to 70.3 mA for about 7.8 hours of runtime.
- Designed a 3D-printed ABS enclosure in Onshape that holds the board, a battery bay, the LCD, switch, USB port, LEDs and buzzer, and fits in 160.5 × 117 × 57.4 mm.
- Wired the circuit with 22 AWG wire, color-coded by function, and tested how it held up.

## How it works

The TMP36 outputs a voltage that grows with temperature. The Arduino reads it on pin A0, converts the reading to volts, then to °C and °F, and shows the result on an I2C LCD. A simple threshold check picks the status: **COLD** under 60°F, **HIGH** over 80°F, otherwise **NORMAL**. Outside the normal range the red LED on pin 3 lights and the buzzer on pin 5 plays a 1000 Hz tone for one second.

| Part | Connection |
|---|---|
| TMP36 temperature sensor | Analog pin A0 |
| Red alarm LED (220 Ω) | Digital pin 3 |
| Buzzer | Digital pin 5 |
| I2C LCD | SDA / SCL |
| Green power LED (1000 Ω) | Through the power switch |
| Power | 9V battery (550 mAh) through a 2-way switch |

Wires are color-coded: red for power, black for ground, orange for data, white for the TMP36 output.

## Engineering decisions

**22 AWG instead of 28 AWG.** The circuit draws only about 70 mA, but thin wire is fragile and hard to work with. 22 AWG has about 13 times the current capacity this circuit needs, versus about 3 times for 28 AWG, and it holds up better when twisted into connectors.

**Sizing the LED resistors.** Each LED gets a resistor chosen from the supply voltage and the current I wanted, so the red alarm LED is bright (13.6 mA) while the always-on power LED stays dim and cheap on the battery (3.0 mA).

**Designing the case around the parts.** I modeled the enclosure in Onshape with cutouts for the LCD, switch, USB-B port, power jack, both LEDs and the buzzer, plus a separate battery holder, then checked the print in the slicer before printing in ABS.

<div class="gallery">
  <img src="/projects/room-temperature-monitor/cad-iso.webp" alt="CAD render of the closed enclosure with the LCD window on top.">
  <img src="/projects/room-temperature-monitor/cad-interior.webp" alt="CAD render of the open enclosure showing the battery bay and Arduino mount.">
  <img src="/projects/room-temperature-monitor/cad-top.webp" alt="Top view of the CAD model showing the battery and Arduino layout.">
  <img src="/projects/room-temperature-monitor/print-preview.webp" alt="Slicer preview of the battery holder with support material.">
</div>

## Results

The finished monitor reads the room temperature, displays it, and sounds the alarm outside 60 to 80°F. At 70.3 mA it should run about 7.8 hours on one 9V battery.

## What I learned

Testing the finished build showed me where it was weakest:

- The Arduino's header pins are fragile and easy to bend.
- The TMP36's pins are soft and bend easily, so soldering them properly matters.
- Wires joined with twist-on caps came loose more easily than soldered joints.
- My color-coding was not always consistent, which made the build harder to debug.

**What I would change next:** power it from an AC-to-DC supply so there's no battery limit, solder the TMP36 connections cleanly, and consider an LED-only display to cut power draw.

## Build photos

<div class="gallery">
  <img src="/projects/room-temperature-monitor/top.webp" alt="Top view of the finished monitor.">
  <img src="/projects/room-temperature-monitor/interior-1.webp" alt="Inside the case: Arduino, wiring and battery.">
  <img src="/projects/room-temperature-monitor/interior-2.webp" alt="Interior wiring close-up.">
  <img src="/projects/room-temperature-monitor/interior-3.webp" alt="Interior from another angle.">
</div>
