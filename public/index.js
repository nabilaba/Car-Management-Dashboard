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

const cardCar = (car) => {
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

  const card = document.createElement("div");
  card.classList.add("col");
  card.id = `car-${car.id}`;
  card.innerHTML = `
    <div class="card h-100 rounded-3 shadow">
        <img class="card-img-top" src="${car.image_url}" alt="${
    car.name
  }" height="200" />
        <div class="card-body">
            <p class="card-title">${car.name}</p>
            <h5 class="card-title fw-bold">${formatRP(car.rent_price)}</h5>
            <p>Ukuran: ${car.size}</p>
            <p>Updated at: ${formatUpdateAt(car.updatedAt)}</p>
        </div>
        <div class="card-footer">
            <button class="btn btn-danger" onclick="deleteCar(${
              car.id
            })">Delete</button>
            <button type="button" class="btn btn-primary" onClick="Swal.fire({title: 'Coming Soon!', text: 'Fitur ini akan segera hadir', icon: 'info'})">Update</button>
        </div>
    </div>`;
  return card;
};

const form = document.querySelector("#car-form");
const name = document.querySelector("#name");
const rent_price = document.querySelector("#rent_price");
const size = document.querySelector("#size");
const image_url = document.querySelector("#image_url");
const btn_upload = document.querySelector("#btn_upload");
const anu = document.querySelector("#anu");

btn_upload.addEventListener("click", () => {
  anu.click();
});

anu.addEventListener("change", (e) => {
  const file = e.target.files[0];
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
          image_url.value = `${link}${res.path}`;
        }
      });
    })
    .catch((err) => {
      Swal.fire("Error!", "Pastikan koneksimu stabil", "error");
    });
});

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
