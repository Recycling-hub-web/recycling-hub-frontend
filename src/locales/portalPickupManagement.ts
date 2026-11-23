/** Request management and receiving UI copy. Customer data and command payloads stay unchanged. */
export const portalPickupManagementBm: Record<string, string> = {
  'View pickup request {code}': 'Lihat permintaan kutipan {code}',
  '{count} orders': '{count} pesanan',
  'Orders ({count})': 'Pesanan ({count})',
  'Evaluate {name}': 'Nilai {name}',
  'Re-evaluate {name}': 'Nilai semula {name}',
  Continue: 'Teruskan',
  'Materials (optional)': 'Bahan (pilihan)',
  'Material category': 'Kategori bahan',
  'Add another item': 'Tambah item lain',
  'e.g. kg': 'cth. kg',
  'Could not upload the photo.': 'Tidak dapat memuat naik foto.',
  'Could not create this order. Please try again.':
    'Tidak dapat mencipta pesanan ini. Sila cuba lagi.',
  'Could not evaluate this pickup request. Please try again.':
    'Tidak dapat menilai permintaan kutipan ini. Sila cuba lagi.',

  'This request has {count} orders. Optional: add up to {remaining} more here, each with its materials and at least one photo. Existing orders are edited from their own pages.':
    'Permintaan ini mempunyai {count} pesanan. Pilihan: tambah sehingga {remaining} pesanan lagi di sini, setiap satu dengan bahan dan sekurang-kurangnya satu foto. Pesanan sedia ada diedit daripada halamannya sendiri.',
  'Pickup requests from the website or added by staff will show up here.':
    'Permintaan kutipan daripada laman web atau yang ditambah oleh kakitangan akan dipaparkan di sini.',
  'Try a different status filter.': 'Cuba penapis status lain.',
  'No matches for "{search}".': 'Tiada padanan untuk "{search}".',
  '{count} selected': '{count} dipilih',
  'Search pickup requests': 'Cari permintaan kutipan',
  Photos: 'Foto',
  'Add photo': 'Tambah foto',
  'Add item': 'Tambah item',
  'Remove item': 'Buang item',
  Item: 'Item',
  'Estimated quantity': 'Anggaran kuantiti',
  'Quantity unit': 'Unit kuantiti',
  'e.g. 10': 'cth. 10',
  'Clear address': 'Kosongkan alamat',
  'No addresses found.': 'Tiada alamat ditemui.',

  'Schedule pickup': 'Jadualkan kutipan',
  'Scheduling…': 'Sedang menjadualkan…',
  Schedule: 'Jadualkan',
  'Assign a driver. The driver will confirm the pickup date and time.':
    'Tugaskan pemandu. Pemandu akan mengesahkan tarikh dan masa kutipan.',
  'Assign driver': 'Tugaskan pemandu',
  'Assigning…': 'Sedang menugaskan…',
  'Assign one driver to {value0} selected order{value1}. The driver will confirm pickup times.':
    'Tugaskan seorang pemandu kepada {value0} pesanan dipilih. Pemandu akan mengesahkan masa kutipan.',
  'Assign {value0} order{value1}': 'Tugaskan {value0} pesanan',
  'Choose a driver.': 'Pilih pemandu.',
  'Could not load drivers.': 'Tidak dapat memuatkan pemandu.',
  'Retry drivers': 'Cuba semula pemandu',
  'Could not schedule this pickup. Please try again.':
    'Tidak dapat menjadualkan kutipan ini. Sila cuba lagi.',
  'Could not assign these orders. Please try again.':
    'Tidak dapat menugaskan pesanan ini. Sila cuba lagi.',
  'Cancel pickup': 'Batalkan kutipan',
  "This can't be undone.": 'Tindakan ini tidak boleh dibatalkan.',
  'Keep request': 'Kekalkan permintaan',
  'Cancelling…': 'Sedang membatalkan…',
  'Cancellation reason': 'Sebab pembatalan',
  'Why is this pickup being cancelled?': 'Mengapa kutipan ini dibatalkan?',
  'Cancel pickup request': 'Batalkan permintaan kutipan',
  "This cancels every order still in progress under this request. This can't be undone.":
    'Ini membatalkan semua pesanan yang masih diproses di bawah permintaan ini. Tindakan ini tidak boleh dibatalkan.',
  'Why is this pickup request being cancelled?':
    'Mengapa permintaan kutipan ini dibatalkan?',
  'A cancellation reason is required.': 'Sebab pembatalan diperlukan.',
  'Could not cancel this pickup request. Please try again.':
    'Tidak dapat membatalkan permintaan kutipan ini. Sila cuba lagi.',
  'Could not cancel this pickup. Please try again.':
    'Tidak dapat membatalkan kutipan ini. Sila cuba lagi.',
  'Pickup request created': 'Permintaan kutipan dicipta',
  'A request for {value0} has been added and {value1}.':
    'Permintaan untuk {value0} telah ditambah dan {value1}.',
  'Request created, but evaluation failed':
    'Permintaan dicipta, tetapi penilaian gagal',
  'Open the pickup request and evaluate it from there.':
    'Buka permintaan kutipan dan lakukan penilaian di sana.',
  'A request for {value0} has been added.':
    'Permintaan untuk {value0} telah ditambah.',
  'A request for {name} has been added.':
    'Permintaan untuk {name} telah ditambah.',
  'A request for {name} has been added with {count} orders.':
    'Permintaan untuk {name} telah ditambah dengan {count} pesanan.',
  'Back to quick leads': 'Kembali ke permintaan panggilan ringkas',
  'This form follows up on a Quick Lead. To create a brand-new pickup request, use the':
    'Borang ini untuk susulan permintaan panggilan ringkas. Untuk mencipta permintaan kutipan baharu, gunakan',
  "list's “New request” action instead.":
    'tindakan “Permintaan baharu” dalam senarai.',
  'Loading lead…': 'Sedang memuatkan permintaan panggilan…',
  'This lead has been cancelled and cannot be converted.':
    'Permintaan panggilan ini telah dibatalkan dan tidak boleh ditukar.',
  'Follow up on quick lead': 'Susulan permintaan panggilan ringkas',
  'Complete the rest of the details to create the real pickup request.':
    'Lengkapkan butiran selebihnya untuk mencipta permintaan kutipan sebenar.',
  'e.g. Fatima Ali': 'cth. Fatima Ali',
  'e.g. fatima@recyclinghub.example': 'cth. fatima@recyclinghub.example',
  'Phone number': 'Nombor telefon',
  'Phone Number': 'Nombor Telefon',
  'Country calling code': 'Kod panggilan negara',
  'Request type': 'Jenis permintaan',
  Individual: 'Individu',
  Business: 'Perniagaan',
  Open: 'Terbuka',
  Fulfilled: 'Selesai',
  'Address where materials should be collected':
    'Alamat tempat bahan perlu dikutip',
  'Anything else worth noting': 'Apa-apa lagi yang perlu dimaklumkan',
  Note: 'Nota',
  Evaluation: 'Penilaian',
  '(optional)': '(pilihan)',
  "Already know the outcome? Decide it now and skip the Evaluate step on the order's details page.":
    'Sudah tahu keputusannya? Putuskan sekarang dan langkau langkah Penilaian pada halaman butiran pesanan.',
  'Evaluation decision': 'Keputusan penilaian',
  'Why this request is being rejected': 'Mengapa permintaan ini ditolak',
  'Creating…': 'Sedang mencipta…',
  'Create request': 'Cipta permintaan',
  'Order created': 'Pesanan dicipta',
  'Order {value0} has been created.': 'Pesanan {value0} telah dicipta.',
  'Loading pickup request…': 'Sedang memuatkan permintaan kutipan…',
  'Pickup request not found.': 'Permintaan kutipan tidak ditemui.',
  'Back to pickup request': 'Kembali ke permintaan kutipan',
  'Create order': 'Cipta pesanan',
  "For {value0}'s pickup request — materials/items are optional here and can be added later.":
    'Untuk permintaan kutipan {value0} — bahan/item adalah pilihan di sini dan boleh ditambah kemudian.',
  'Optional — add orders now, or later from the request. Each order needs its materials and at least one photo.':
    'Pilihan — tambah pesanan sekarang atau kemudian daripada permintaan. Setiap pesanan memerlukan bahan dan sekurang-kurangnya satu foto.',
  'Add order': 'Tambah pesanan',
  'Remove order': 'Buang pesanan',
  'Already know the outcome? Decide it now for the whole request and skip the Evaluate step later. One total is shared across the orders.':
    'Sudah tahu keputusannya? Putuskan sekarang untuk seluruh permintaan dan langkau langkah Penilaian kemudian. Satu jumlah dikongsi antara pesanan.',
  'Why this order is being rejected': 'Mengapa pesanan ini ditolak',
  'Opening order…': 'Sedang membuka pesanan…',
  Edit: 'Edit',
  'Back to pickup requests': 'Kembali ke permintaan kutipan',
  'New pickup request': 'Permintaan kutipan baharu',
  'Fields marked': 'Medan bertanda',
  'are required. You can review everything before you submit.':
    'diperlukan. Anda boleh menyemak semuanya sebelum menghantar.',
  'New pickup request steps': 'Langkah permintaan kutipan baharu',
  Customer: 'Pelanggan',
  Pickup: 'Kutipan',
  'No orders. You can add them later from the request.':
    'Tiada pesanan. Anda boleh menambahnya kemudian daripada permintaan.',
  'Step {step} of {total}': 'Langkah {step} daripada {total}',
  '{count} done': '{count} selesai',
  Back: 'Kembali',
  'Pickup request cancelled': 'Permintaan kutipan dibatalkan',
  'Cancel request': 'Batalkan permintaan',
  '{value0} · {value1} order{value2}': '{value0} · {value1} pesanan',
  Cancellation: 'Pembatalan',
  'Cancelled at': 'Dibatalkan pada',
  'No orders yet': 'Belum ada pesanan',
  'Create one to start the materials, pricing and driver workflow.':
    'Cipta pesanan untuk memulakan aliran kerja bahan, harga dan pemandu.',
  'Pickup request evaluated': 'Permintaan kutipan dinilai',
  'Its orders were updated.': 'Pesanannya telah dikemas kini.',
  'Photo still uploading': 'Foto masih dimuat naik',
  'Wait for the photo to finish uploading, then save.':
    'Tunggu sehingga foto selesai dimuat naik, kemudian simpan.',
  'Wait for the photo to finish uploading, then submit.':
    'Tunggu sehingga foto selesai dimuat naik, kemudian hantar.',
  'Some orders were not added': 'Sesetengah pesanan tidak ditambah',
  'Pickup request updated': 'Permintaan kutipan dikemas kini',
  'Edit pickup request': 'Edit permintaan kutipan',
  'New orders': 'Pesanan baharu',
  'Save changes': 'Simpan perubahan',
  'Lead marked as contacted': 'Permintaan panggilan ditandakan telah dihubungi',
  'Could not update this lead':
    'Tidak dapat mengemas kini permintaan panggilan ini',
  '{value0} request{value1} assigned to a driver':
    '{value0} permintaan ditugaskan kepada pemandu',
  'No pickup requests found': 'Tiada permintaan kutipan ditemui',
  "The customer's ask — collection requests submitted from the public site or added by staff.":
    'Permintaan pelanggan — permintaan kutipan yang dihantar melalui laman awam atau ditambah oleh kakitangan.',
  'New request': 'Permintaan baharu',
  'Search by code, name, email, or phone…':
    'Cari mengikut kod, nama, e-mel atau telefon…',
  'Select all assignable requests':
    'Pilih semua permintaan yang boleh ditugaskan',
  Code: 'Kod',
  Name: 'Nama',
  Type: 'Jenis',
  "{value0}'s orders were updated.": 'Pesanan {value0} telah dikemas kini.',
  'Loading pickup requests…': 'Sedang memuatkan permintaan kutipan…',
  'All Requests': 'Semua Permintaan',
  'Quick Leads': 'Permintaan Panggilan Ringkas',
  'All types': 'Semua jenis',
  'Lead cancelled': 'Permintaan panggilan dibatalkan',
  'No quick leads yet': 'Belum ada permintaan panggilan ringkas',
  'Quick callback requests from the website will show up here.':
    'Permintaan panggilan balik ringkas daripada laman web akan dipaparkan di sini.',
  'View request': 'Lihat permintaan',
  'Mark lead from {value0} as contacted':
    'Tandakan permintaan panggilan daripada {value0} telah dihubungi',
  'Follow up on lead from {value0}':
    'Susulan permintaan panggilan daripada {value0}',
  'Cancel lead from {value0}':
    'Batalkan permintaan panggilan daripada {value0}',
  'Cancel quick lead': 'Batalkan permintaan panggilan ringkas',
  'Cancel the lead from {value0}? It will remain visible, but cannot be contacted or converted.':
    'Batalkan permintaan panggilan daripada {value0}? Ia akan kekal kelihatan, tetapi tidak boleh dihubungi atau ditukar.',
  'Cancel lead': 'Batalkan permintaan panggilan',
  'Keep lead': 'Kekalkan permintaan panggilan',
  'Re-evaluate pickup request': 'Nilai semula permintaan kutipan',
  'Evaluate pickup request': 'Nilai permintaan kutipan',
  '{value0} order{value1}: {value2}': '{value0} pesanan: {value2}',
  Approve: 'Luluskan',
  'Some orders already have a driver. Approving keeps them on it with the new price; rejecting takes those orders off the driver.':
    'Sesetengah pesanan sudah mempunyai pemandu. Kelulusan mengekalkan pemandu dengan harga baharu; penolakan mengeluarkan pesanan tersebut daripada pemandu.',
  'The total is shared across the orders by their estimated quantity.':
    'Jumlah dikongsi antara pesanan mengikut anggaran kuantiti.',
  'Required to reject — optional otherwise.':
    'Diperlukan untuk penolakan — pilihan untuk tindakan lain.',
  'Cancel order': 'Batalkan pesanan',
  'No materials': 'Tiada bahan',
  ' · RM {value0}': ' · RM {value0}',
  'Order actions': 'Tindakan pesanan',
  'RM {value0}': 'RM {value0}',
  'Evaluated by': 'Dinilai oleh',
  'Evaluated at': 'Dinilai pada',
  'All stores': 'Semua pusat',
  'Verified and closed': 'Disahkan dan ditutup',
  'Could not close this request. Please try again.':
    'Tidak dapat menutup permintaan ini. Sila cuba lagi.',
  'Nothing to verify yet': 'Belum ada penghantaran untuk disahkan',
  'Delivered requests will show up here once a driver drops off their route.':
    'Permintaan yang dihantar akan dipaparkan di sini selepas pemandu membuat serahan laluan.',
  'Verify and close delivery from {value0}':
    'Sahkan dan tutup penghantaran daripada {value0}',
  "Verify and close requests once a driver's route has been dropped off.":
    'Sahkan dan tutup permintaan selepas laluan pemandu diserahkan.',
  'Delivered — awaiting verification': 'Dihantar — menunggu pengesahan',
  Store: 'Pusat',
  'Retry collection points': 'Cuba semula pusat kutipan',
  'Category / quantity': 'Kategori / kuantiti',
  deliveries: 'penghantaran',
  'Price each item': 'Harga setiap item',
  'Added up into the total below.': 'Dijumlahkan dalam jumlah di bawah.',
  'One total for the whole pickup.': 'Satu jumlah untuk seluruh kutipan.',
  'Price for {value0}': 'Harga untuk {value0}',
  Total: 'Jumlah',
  'Total price': 'Jumlah harga',
  'Remove photo {value0}': 'Buang foto {value0}',
  'Who the request is for and how to reach them.':
    'Untuk siapa permintaan ini dibuat dan cara menghubunginya.',
  'When and where to collect.': 'Bila dan di mana kutipan dibuat.',
  'Optional. Add orders now, or later from the request. Each order needs its materials and at least one photo.':
    'Pilihan. Tambah pesanan sekarang atau kemudian daripada permintaan. Setiap pesanan memerlukan bahan dan sekurang-kurangnya satu foto.',
  'Review and submit': 'Semak dan hantar',
  'Check everything, then create the request.':
    'Semak semuanya, kemudian cipta permintaan.',
  'Full name is required.': 'Nama penuh diperlukan.',
  'Email is required for business requests.':
    'E-mel diperlukan untuk permintaan perniagaan.',
  'Pickup address is required.': 'Alamat kutipan diperlukan.',
  'Add at least one photo of the materials.':
    'Tambah sekurang-kurangnya satu foto bahan.',
  'Every order needs its materials to price per item — or use one total.':
    'Setiap pesanan memerlukan bahan untuk harga setiap item — atau gunakan satu jumlah.',
  'Not yet': 'Belum lagi',
  'Enter a valid price for every item.':
    'Masukkan harga yang sah untuk setiap item.',
  'Enter a valid price.': 'Masukkan harga yang sah.',
  'A reason is required when rejecting.': 'Sebab diperlukan untuk penolakan.',
  'Rejected — {reason}': 'Ditolak — {reason}',
  'Approved, RM {amount} (priced per item)':
    'Diluluskan, RM {amount} (harga setiap item)',
  'Approved, RM {amount}': 'Diluluskan, RM {amount}',
  'Order {number}': 'Pesanan {number}',
  'Check this step': 'Semak langkah ini',
  '{step} has something to fix.':
    '{step} mempunyai sesuatu yang perlu dibetulkan.',
  'Could not create the request': 'Tidak dapat mencipta permintaan',
  'Please wait…': 'Sila tunggu…',
  filters: 'penapis',
  'Hide {label}': 'Sembunyikan {label}',
  'Could not load pickup requests.':
    'Tidak dapat memuatkan permintaan kutipan.',
};
