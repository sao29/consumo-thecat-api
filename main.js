const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2&api_key=a436c5db-c690-4c4b-a598-fee16aba6889';
const API_URL_FAVOTITES = 'https://api.thecatapi.com/v1/favourites?api_key=a436c5db-c690-4c4b-a598-fee16aba6889';
const API_URL_FAVOTITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=a436c5db-c690-4c4b-a598-fee16aba6889`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';


//agregar Axios
const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
  });
  api.defaults.headers.common['X-API-KEY'] = 'c08d415f-dea7-4a38-bb28-7b2188202e46';

  // solo se agre la base de la url y el head ya lleva impiclita la api key

const spanError = document.getElementById('error')

async function loadRandomMichis() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();
  console.log('Random')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;
  } else {
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    
    img1.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = () => saveFavouriteMichi(data[0].id);
    btn2.onclick = () => saveFavouriteMichi(data[1].id);
  }
}

async function loadFavouriteMichis() {
  const res = await fetch(API_URL_FAVOTITES);
  const data = await res.json();
  console.log('Favoritos')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {

    const section = document.getElementById('favoriteMichis')
      //vaciamos todo el section
      section.innerHTML = "";
    // agregamos el titulo del section
      const h2 = document.createElement('h2')
     const h2Text = document.createTextNode("titulo nuevo");
     h2.appendChild(h2Text);
     section.appendChild(h2);
    data.forEach(michi => {
      
      const article = document.createElement('article');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('Sacar al michi de favoritos');

      img.src = michi.image.url;
      img.width = 150;
      btn.appendChild(btnText);
      btn.onclick = ()=> deleteFavouriteMichi(michi.id);
      article.appendChild(img);
      article.appendChild(btn);
      section.appendChild(article);
      
      
    });
  }
}

async function saveFavouriteMichi(id) {
// guarda michis a travez de AXIOS
const { data, status } = await api.post('/favourites', {
    image_id: id,
  });



//metod con FETCH
//   const res = await fetch(API_URL_FAVOTITES, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       image_id: id
//     }),
//   });
//   const data = await res.json();

  console.log('Save')
  if (status !== 200) {
    spanError.innerHTML = "Hubo un error: " + status + data.message;
  } else {
       //una vez presionado el boto guardar favorito si todo sale bien ejecutar la funcion loadFavouriteMichis la cual recarga todos los elementos guardados
    console.log('Michi guardado en favoritos')
    loadFavouriteMichis();
  }
}




async function deleteFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVOTITES_DELETE(id), {
      method: 'DELETE',
    });
    const data = await res.json();
  
    if (res.status !== 200) {
      spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {

        //una vez ejecutada la funcion de eliminar entonces ejecutar la funcion de cargar todos los michis
      console.log('Michi eliminado de favoritos')
      loadFavouriteMichis();
    }
  }
  async function uploadMichiPhoto() {
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form);
  
    console.log(formData.get('file'))
  
    const res = await fetch(API_URL_UPLOAD, {
      method: 'POST',
      headers: {
          //no se ocupa poner el boundery ya que fetch pone todo por defecto
        // 'Content-Type': 'multipart/form-data',
        'X-API-KEY': 'a436c5db-c690-4c4b-a598-fee16aba6889',
      },
      body: formData,
    })
    const data = await res.json();
  
    if (res.status !== 201) {
      spanError.innerHTML = "Hubo un error: " + res.status + data.message;
      console.log({data})
    } else {
      console.log('Foto de michi subida :)')
      console.log({data})
      console.log(data.url)
      saveFavouriteMichi(data.id);
    }
  }
  
  function miniatura() {
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form)
	//usamos el FileReader para sacar la información del archivo del formData
    const reader = new FileReader();

//Este código es para borrar la miniatura anterior al actualizar el form.
    if (form.children.length === 3) {
        const preview = document.getElementById("preview")
        form.removeChild(preview)
    }
//aquí sucede la magia, el reader lee los datos del form.
    reader.readAsDataURL(formData.get('file'))

//Éste código es para cuando termine de leer la info de la form, cree una imagen miniatura de lo que leyó el form.
    reader.onload = () => {
        const previewImage = document.createElement('img')
        previewImage.id = "preview"
        previewImage.width = 50
        previewImage.src = reader.result
        form.appendChild(previewImage);
    }

}

loadRandomMichis();
loadFavouriteMichis();