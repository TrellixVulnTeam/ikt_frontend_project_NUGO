import { Injectable } from '@angular/core';
declare var db :any;
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public storageName = "posts";
  constructor() {}
  add(object: any) {
    return new Promise(async(resolve, reject) => {
      if(db != undefined) {
        object.forEach(async(element: {
          id: any;title: any;description: any;image: any
        }) => {
          const request = await db.transaction(["receipeblog"], "readwrite").objectStore("receipeblog").add({
            id: element.id,
            title: element.title,
            description: element.description,
            image: element.image
          }); //db.transaction([this.storageName],"readwrite").objectStore(this.storageName).put(value,keyName)
          request.onsuccess = function(event: any) {
            console.log("Prasad has been added to your database.");
          };
          request.onerror = function(event: any) {
            console.log("Unable to add data\r\nPrasad is already exist in your database! ");
          }
        });
      }
    })
  }
  addSinglePost(object: {
    title: string;description: string;image: string
  }) {
    return new Promise(async(resolve, reject) => {
      if(db != undefined) {
        let index = await this.getLastIdfromIndexDB();
        const request = await db.transaction(["receipeblog"], "readwrite").objectStore("receipeblog").add({
          id: index,
          title: object.title,
          description: object.description,
          image: object.image
        }); //db.transaction([this.storageName],"readwrite").objectStore(this.storageName).put(value,keyName)
        request.onsuccess = function(event: any) {
          console.log("Prasad has been added to your database.");
        };
        request.onerror = function(event: any) {
          console.log("Unable to add data\r\nPrasad is already exist in your database! ");
        }
      }
    })
  }
  //Read all posts from indexDB
  readAll() {
      return new Promise((resolve, reject) => {
        var objectStore = db.transaction("receipeblog").objectStore("receipeblog");
        let posts: object[] = [];
        objectStore.openCursor().onsuccess = function(event: any) {
          let cursor = event.target.result;
          if(cursor) {
            posts.push({
              id: cursor.key,
              title: cursor.value.title,
              description: cursor.value.description,
              image: cursor.value.image
            });
            cursor.continue();
          } else {
            resolve(posts)
          }
        };
      })
    }
  //to get the last id of rows
  getLastIdfromIndexDB() {
    return new Promise((resolve, reject) => {
      var objectStore = db.transaction("receipeblog").objectStore("receipeblog");
      let ids: string[] = [];
      objectStore.openCursor().onsuccess = function(event: any) {
        let cursor = event.target.result;
        if(cursor) {
          ids.push(cursor.key)
          cursor.continue();
        } else {
          let index = ids.length || 0;
          resolve(index)
        }
      };
    })
  }
  delete(id: number) {
    return new Promise(async(resolve, reject) => {
      if(db != undefined) {
        const request = db.transaction(["receipeblog"], "readwrite").objectStore("receipeblog").delete(id);
        request.onsuccess = () => resolve(true);
      }
    })
  }
}
