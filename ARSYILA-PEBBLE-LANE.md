# Arsyila’s Pebble Lane

Permainan hitung singkat untuk anak. Delapan soal, lalu sebuah bintang. Tidak perlu akun. Kemajuan tersimpan di perangkat yang sedang dipakai.

A short math club for a child. Eight questions, then a star. No account. Progress stays on the device in use.

## Cara main

1. Pilih **Bahasa Indonesia** atau **English**. Bahasa bisa diganti di tengah ronde; soal yang sama ikut berubah.
2. Isi nama pemain. Kosongkan, maka namanya **Teman** (Indonesia) atau **Friend** (English).
3. Pilih jalur sesuai besar angkanya.
4. Pilih satu permainan. Satu ronde berisi 8 soal dan 4 pilihan jawaban.
5. Jawaban benar langsung lanjut. Jawaban salah berhenti dulu, lalu tekan **Soal berikut**.
6. Bintang hanya masuk kalau kedelapan soal selesai. Keluar di tengah jalan tidak menambah bintang.

Suara bisa dimatikan dari tombol di kanan atas.

## How to play

1. Choose **Bahasa Indonesia** or **English**. You can switch in the middle of a round; the same question changes with it.
2. Set the player name. Leave it blank and it becomes **Teman** or **Friend**.
3. Pick the lane that matches the size of the numbers.
4. Open one game. A round is 8 questions, each with 4 answers.
5. A right answer moves on. A wrong answer waits until **Next**.
6. Stars are saved only when all eight are finished. Leaving early adds none.

Sound is the button at the top right.

## Jalur / Lanes

| Usia | Indonesia | English | Isi |
| --- | --- | --- | --- |
| 5–6 | Kerikil | Pebbles | Berhitung, jumlah sampai 10, pengurangan mudah |
| 7–8 | Batu | Stones | Jumlah lebih besar, kembalian dari 20, perkalian 2–5 dan 10 |
| 9–11 | Bongkah | Boulders | Perkalian sampai 12, bagi rata, kembalian dari 50 |

## Permainan / Games

| Indonesia | English | Apa yang dilatih |
| --- | --- | --- |
| Kartu hitung | Flash cards | Satu hitungan, empat pilihan |
| Warung | Market stall | Jumlah harga, atau kembalian |
| Baris kebun | Orchard rows | Kelompok yang sama, dihitung dari gambar |
| Batu hilang | Missing stone | Angka yang kosong di persamaan |

## Bintang / Stars

| Benar dari 8 | Bintang |
| --- | --- |
| 8 | 3 |
| 6–7 | 2 |
| 4–5 | 1 |
| 0–3 | 0 |

Jumlah bintang dan rekor beruntun tetap ada setelah browser ditutup, selama data situs tidak dihapus.

## Menjalankan di komputer

Butuh Node.js 22. Cek dengan `node -v`.

```bash
mkdir arsyila-pebble-lane
cd arsyila-pebble-lane
unzip /path/to/arsyila-pebble-lane.zip
npm install
npm run dev
```

Buka `http://localhost:8080`. Berhenti dengan Ctrl+C.

Tidak perlu akun atau database. Bintang tersimpan di browser itu, selama data situs tidak dihapus.

File permainan ada di `src/lib/pebble/` (soal, bahasa, simpanan, suara) dan `src/components/pebble/`.
