import { fromJS } from 'immutable';

// curl 'https://wiki.heath.cc/update'
// --data $'{"new_text":"thought capture:\\n * clean before party, especially the study\041\\n * seedling plants are doing well\\n * elasticsearch might have native html support\\n * \\n\\n\\nkitchen person: joes friend? guy across the road? \\n\\nradio: https://github.com/downshift-js/downshift <- might not be so... big... as react-select?\\n\\n\\nDoors @ sorrento: discontinued color.\\n\\nWhat do I want to be doing?\\n\\nGame planning: would be nice to have some kind of structured mind-mapping thing.\\n * I like freeplane, but the mind-map layout isn\'t really what I\'m after, and there\'s no real interlinking (more like a wiki).\\n * I\'d be happy with a set of textfiles containing everything (toml?) and a separate renderer\\n\\nWould be good for a game planner to focus more on what makes a good game\\n\\nActiveFacts: would be interesting to do a quiz-style schema discovery thing.\\nactivefacts-admin: activefacts-driven admin interface generator - ideally go + sqlite or something so it isn\'t such a hassle to run.\\n\\nrun a jail and expose to the outside world -> put nginx in it and forward specific sites to other internal sites, with https and password.\\n\\nGAN stuff would be kinda cool\\n\\nWrite a letter to Matthew - Rhiana to put in scrapbook. Also, which baby names I liked. TBH I don\'t really remember anymore.\\n\\nSand/polish outdoor furniture\\n\\nFix knight jacket elbow\\n\\nEmail: Set automated reminders for the future\\n\\nbackup heath-it (somewhere I\'ll be able to get it)\041\\n\\nVisit Zio & Zia (Ph:03 9348 0556 , Addr: 805/668 Swanson Street opposite Melbourne Uni)\\n\\nOffer Nonna a place to keep a spare key at ours (hidden in a sealed envelope)\\n\\nReading list:\\n * Pikketty\\n * Deming\\n * Feynmann\\n * \\"The brain that changes itself\\"\\n\\nFind out if any are available at local libraries.",
//           "page":"todo"}'

// `Authorization: auth`

export default (baseUrl, auth) => {
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, baseUrl.length - 1)
  }

  const docFromPage = (html) => {
    const c = document.createElement('html')
    c.innerHTML = html
    return c
  }

  const cowGet = (path) =>
    fetch(baseUrl + path, {
      method: 'GET', // or 'PUT'
      headers:{
        'Authorization': auth,
      }
    }).then(res => res.text()).then(res => docFromPage(res))

  const isSignedIn = () => new Promise(resolve => resolve(true));

  const getDirectoryListing = path =>
    new Promise((resolve, reject) => {
      cowGet("/ls")
        .then(doc => {
          // return doc.querySelector("table").value;
          const entries = fromJS(
            Array.from(doc.querySelectorAll('#rendered table td:first-child a[href]')).map((entry) => {
              let url = entry.attributes['href'].value;
              return {
                id: entry.textContent,
                name: entry.textContent,
                isDirectory: false,
                path: '/' + url.split('/')[1],
              }
            })
          );
          resolve({
            listing: entries,
            hasMore: false,
          });
        })
        .catch(reject);
    });

  // ls returns everything, every time.
  const getMoreDirectoryListing = additionalSyncBackendState => {
  };

  const uploadFile = (path, contents) =>
    new Promise((resolve, reject) => {
      debugger
      return 1

      // dropboxClient
      //   .filesUpload({
      //     path,
      //     contents,
      //     mode: {
      //       '.tag': 'overwrite',
      //     },
      //     autorename: true,
      //   })
      //   .then(resolve)
      //   .catch(reject)
    });

  const updateFile = uploadFile;
  const createFile = uploadFile;

  const getFileContentsAndMetadata = path =>
    new Promise((resolve, reject) => {
      cowGet(path + "/edit")
        .then(doc => {
          resolve({
            contents: doc.querySelector('[autofocus]').value,
            lastModifiedAt: null, // not available here
          })
        })
    });

  const getFileContents = path =>
    new Promise((resolve, reject) =>
      getFileContentsAndMetadata(path)
        .then(({ contents }) => resolve(contents))
        .catch(reject)
    );

  const deleteFile = path =>
    new Promise((resolve, reject) => {
      debugger
      return 1
      // dropboxClient
      //   .filesDelete({ path })
      //   .then(resolve)
      //   .catch(error => reject(error.error.error['.tag'] === 'path_lookup', error))
    });

  return {
    type: 'Cowyo',
    isSignedIn,
    getDirectoryListing,
    getMoreDirectoryListing,
    updateFile,
    createFile,
    getFileContentsAndMetadata,
    getFileContents,
    deleteFile,
  };
};
