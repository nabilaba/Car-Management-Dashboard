let link = document.location.href;

document.querySelector(
  "#endpoint"
).innerHTML = `<li>Get All Cars: GET ${link}cars</li>
<li>Get Car By ID: GET ${link}cars/:id</li>
<li>Create Car: POST ${link}cars</li>
<li>Update Car By ID: PUT ${link}cars/:id</li>
<li>Delete Car By ID: DELETE ${link}cars/:id</li>
<li>Delete All Cars: DELETE ${link}cars</li>
<li>Upload Image Car: POST ${link}cars/upload</li>`;

const deleteCar = (id) => {
  Swal.fire({
    title: "Apakah kamu yakin?",
    text: "Kamu tidak dapat mengembalikan data ini!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Tidak, batalkan!",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/cars/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          document.querySelector(`#car-${id}`).remove();
          Swal.fire("Berhasil!", "Data berhasil dihapus.", "success");
        })
        .catch((err) => {
          Swal.fire(
            "Error!",
            "Data tidak dapat ditemukan. Coba refresh halaman.",
            "error"
          );
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Dibatalkan", "Datamu tidak jadi dihapus :)", "error");
    }
  });
};

const formatUpdateAt = (date) => {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString("default", { month: "short" });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  return `${day} ${month} ${year}, ${hour}:${minute}`;
};

const formatRP = (price) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  const priceInt = parseInt(price);
  return formatter.format(priceInt);
};

const cardCar = (car) => {
  const card = document.createElement("div");
  card.classList.add("col");
  card.id = `car-${car.id}`;
  card.innerHTML = `
    <div class="card h-100 rounded-3 shadow">
        <img class="card-img-top" src="${car.image_url}" alt="${
    car.name
  }" height="200" role="button" onClick="showDetailCar(${car.id})">
        <div class="card-body">
            <p class="card-title">${car.name}</p>
            <h5 class="card-title fw-bold">${formatRP(car.rent_price)}</h5>
            <p class="my-0">Ukuran: ${car.size}</p>
            <p class="my-0">Updated at: ${formatUpdateAt(car.updatedAt)}</p>
        </div>
        <div class="card-footer">
            <button class="btn btn-danger" onclick="deleteCar(${
              car.id
            })">Hapus</button>
            <button type="button" class="btn btn-primary" onClick="updateCarWithBootstrapModal(${
              car.id
            })">Perbarui</button>
        </div>
    </div>`;
  return card;
};

const showDetailCar = (id) => {
  fetch(`/cars/${id}`)
    .then((res) => res.json())
    .then((car) => {
      const modal = document.querySelector("#detailModal");
      modal.querySelector(".modal-body").innerHTML = `
      <img class="w-100" src="${car.image_url}" alt="${car.name}" height="250">
      <div class="p-4">
          <p class="my-0">${car.name}</p>
          <p class="my-0">${formatRP(car.rent_price)}</p>
          <p class="my-0">Ukuran: ${car.size}</p>
          <p class="my-0">Updated at: ${formatUpdateAt(car.updatedAt)}</p>
      </div>
        `;
      const myModal = new bootstrap.Modal(modal);
      myModal.show();
    })
    .catch((err) => {
      Swal.fire(
        "Error!",
        "Data tidak dapat ditemukan. Coba refresh halaman.",
        "error"
      );
    });
};

const updateCarWithBootstrapModal = (id) => {
  fetch(`/cars/${id}`)
    .then((res) => res.json())
    .then((car) => {
      const modal = document.querySelector("#updateModal");
      modal.querySelector(".modal-body").innerHTML = `
      <form id="updateForm">
        <div class="mb-2">
          <label for="name" class="form-label">Nama</label>
          <input type="text" class="form-control" id="name" name="name" value="${
            car.name
          }" required>
        </div>
        <div class="mb-2">
          <label for="rent_price" class="form-label">Sewa / Hari</label>
          <input type="number" class="form-control" id="rent_price" name="rent_price" value="${
            car.rent_price
          }" required>
        </div>
        <div class="mb-2">
          <label for="size" class="form-label">Ukuran</label>
          <select class="form-select" name="size" id="size" required>
            <option value="Kecil" ${
              car.size === "Kecil" ? "selected" : ""
            }>Kecil</option>
            <option value="Sedang" ${
              car.size === "Sedang" ? "selected" : ""
            }>Sedang</option>
            <option value="Luas" ${
              car.size === "Luas" ? "selected" : ""
            }>Luas</option>
          </select>
        </div>
        <div class="mb-2">
          <label for="image_url" class="form-label">Foto</label>
          <div class="input-group">
            <input class="form-control" type="url" name="image_url" id="image_url" placeholder="https://..." value="${
              car.image_url
            }" required>
            <button class="btn btn-success" type="button" id="btn_upload" onclick="updateForm.anu.click()">Upload</button>
          </div>
        </div>
        <input class="form-control" type="file" name="anu" id="anu" hidden onchange="uploadImage(this, updateForm.image_url)">
        <button type="submit" class="btn btn-primary w-100 mt-2">Simpan</button>
      </form>`;
      const myModal = new bootstrap.Modal(modal);
      myModal.show();
      const form = document.querySelector("#updateForm");
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        fetch(`/cars/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.value,
            rent_price: form.rent_price.value,
            size: form.size.value,
            image_url: form.image_url.value,
          }),
        })
          .then((res) => res.json())
          .then((car) => {
            const card = document.querySelector(`#car-${car.id}`);
            card.replaceWith(cardCar(car));
            myModal.hide();
            Swal.fire("Berhasil!", "Data berhasil diupdate", "success");
          })
          .catch((err) => {
            Swal.fire("Error!", "Data gagal diupdate", "error");
          });
      });
    })
    .catch((err) => {
      Swal.fire(
        "Error!",
        "Data tidak dapat ditemukan. Coba refresh halaman.",
        "error"
      );
    });
};

const form = document.querySelector("#createForm");
const name = document.querySelector("#name");
const rent_price = document.querySelector("#rent_price");
const size = document.querySelector("#size");
const image_url = document.querySelector("#image_url");

const uploadImage = (e, input) => {
  console.log(input);
  const file = e.files[0];
  const formData = new FormData();
  formData.append("image", file);

  fetch("/cars/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      res.json().then((res) => {
        if (res.status == 400) {
          Swal.fire("Error!", res.message, "error");
        } else {
          input.value = `${link}${res.path}`;
        }
      });
    })
    .catch((err) => {
      Swal.fire("Error!", "Pastikan koneksimu stabil", "error");
    });
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/cars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.value,
      rent_price: Number(rent_price.value),
      size: size.value,
      image_url: image_url.value,
    }),
  });

  const data = await response.json();

  if (data.message) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: data.message,
    });
  } else {
    form.reset();
    Swal.fire("Berhasil!", "Data berhasil ditambahkan.", "success");
    document.querySelector("#result").appendChild(cardCar(data));
  }
});

const result = () => {
  document.querySelector("#result").innerHTML = "";
  fetch("/cars")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((car) => {
        document.querySelector("#result").appendChild(cardCar(car));
      });
    });
};
result();
