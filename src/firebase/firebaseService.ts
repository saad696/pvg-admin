import { createUserWithEmailAndPassword } from "firebase/auth/cordova";
import { auth, db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
  arrayUnion,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { message } from "antd";
import { User as FirebaseUser } from "firebase/auth";
import { status, tables } from "../utils/constants";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const firebaseService = {
  uploadImage: async (
    image: File,
    bucketName = "blog-thumbnails"
  ): Promise<{ url: string; path: string }> => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `${bucketName}/${image.name}`);
      const snapShot = await uploadBytes(storageRef, image);

      const path = snapShot.metadata.fullPath;
      const url = await getDownloadURL(snapShot.ref);
      message.success("Image uploaded successfully");
      return { url, path };
    } catch (error) {
      message.error("Something went wrong! uploading image failed");
      return { url: "", path: "" };
    }
  },
  deleteUploadedFile: async (imageName: string) => {
    const storage = getStorage();
    const imageRef = ref(storage, `blog-thumbnails/${imageName}`);

    try {
      await deleteObject(imageRef);
      message.success("Image deleted sucessfully");
    } catch (error) {
      message.error("Something went wrong! deleting image failed");
    }
  },
  createUser: ({ email, password, role, setLoading }: CreateUserForm) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user.uid) {
          const docRef = doc(db, tables.userRoles, user.uid);
          return setDoc(docRef, { role });
        } else {
          setLoading(false);
          message.error("User creation failed, please try again");
        }
      })
      .then((data) => {
        if (data) {
          setLoading(false);
          message.success("user created!");
        }
      })
      .catch((error) => {
        if (error.code == "500") {
          message.error("Something went wrong! cannot create user.");
        } else {
          message.error(error.message);
        }
        setLoading(false);
      });
  },
  getBasicDetails: async (id: string): Promise<BasicDetails | boolean> => {
    try {
      const docRef = doc(db, tables.basicDetails, id);
      const document = await getDoc(docRef);

      if (document.exists() && Object.keys(document).length > 0) {
        return document.data() as BasicDetails;
      } else {
        message.error("Data not found!");
        return false;
      }
    } catch (error) {
      message.error("Something went wrong! failed to fetch details.");
      return false;
    }
  },
  postBasicDetails: async (
    payload: BasicDetailsPayload,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    user: FirebaseUser,
    id: string
  ) => {
    try {
      let finalPayload = {};
      const docRef = doc(db, tables.basicDetails, id);
      const data = await getDoc(docRef);

      if (data.exists() && Object.keys(data.data()).length > 0) {
        finalPayload = {
          ...payload,
          updatedBy: [
            ...data.data().updatedBy,
            { user: user.uid, dateTime: new Date() },
          ],
        };
      } else {
        finalPayload = {
          ...payload,
          updatedBy: [{ user: user.uid, dateTime: new Date() }],
        };
      }

      await setDoc(docRef, finalPayload);
      setLoading(false);
      message.success("Details saved succesfully!");
    } catch (error: any) {
      if (error.code == "500") {
        message.error("Something went wrong! failed to save details.");
      } else {
        message.error(error.message);
      }
      setLoading(false);
    }
  },
  deleteSocialMap: async (field: string, id: string) => {
    const docRef = doc(db, tables.basicDetails, id);

    try {
      await updateDoc(docRef, {
        [field]: deleteField(),
      });
      message.success(`${field} removed from the socials list`);
    } catch (error: any) {
      if (error.code == "500") {
        message.error("Something went wrong! failed to save details.");
      } else {
        message.error(error.message);
      }
    }
  },
  postTags: async (
    tags: string[],
    type: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.blogTags, type);
    try {
      const tagsDocument = (await getDoc(docRef)).data() as { tags: string[] };

      if (tagsDocument && tagsDocument.tags) {
        const fileteredTagsArray = tagsDocument.tags.filter(
          (tag) => !tags.includes(tag)
        );

        if (tagsDocument.tags.length > fileteredTagsArray.length) {
          message.info("Some repating tags found and removed!");
        }

        const payload = fileteredTagsArray.concat(tags);
        await setDoc(docRef, { tags: payload });
      } else {
        await setDoc(docRef, { tags });
      }
      message.success("Submitted sucessfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Something went wrong, cannot create tags. Please try again!"
      );
    }
  },
  getTags: async (type: string) => {
    const docRef = doc(db, tables.blogTags, type);
    try {
      const tagsDocument = await getDoc(docRef);
      return tagsDocument.data() as { tags: string[] };
    } catch (error) {
      message.error("Something went wrong, cannot fetch tags.");
    }
  },
  deleteTags: async (
    tags: string[],
    type: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.blogTags, type);
    try {
      const tagsDocument = (await getDoc(docRef)).data() as { tags: string[] };

      if (tagsDocument && tagsDocument.tags) {
        const payload = tagsDocument.tags.filter((tag) => !tags.includes(tag));

        await setDoc(docRef, { tags: payload });
      } else {
        message.error("Tags not created yet!");
      }
      message.success("Deleted sucessfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Something went wrong, cannot delete tags. Please try again!"
      );
    }
  },
  postBlog: async (
    payload: BlogDetails,
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.blogs, id);
    try {
      const data = await firebaseService.uploadImage(payload.thumbnail);

      if (data && data.url) {
        await setDoc(
          docRef,
          {
            blog: arrayUnion({
              ...payload,
              thumbnail: { url: data.url, path: data.path },
            }),
          },
          { merge: true }
        );
        message.success("Submitted sucessfully");
      } else {
        message.success("Thumbnail upload failed, please try again.");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Something went wrong, cannot create blog. Please try again!"
      );
    }
  },
  updateBlog: async (
    blogUuid: string,
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    updatedBlogData: Partial<BlogDetails>
  ) => {
    const docRef = doc(db, tables.blogs, id);

    try {
      if (updatedBlogData.thumbnail?.size) {
        const data = await firebaseService.uploadImage(
          updatedBlogData.thumbnail
        );

        updatedBlogData.thumbnail = {
          url: data.url,
          path: data.path,
        };
      }
      const blogSnap = await getDoc(docRef);

      if (!blogSnap.exists()) {
        message.error("No such document found!");
        return;
      }

      const blogs = blogSnap.data().blog as BlogDetails[];

      const blogIndex = blogs.findIndex((blog) => blog.uuid === blogUuid);

      if (blogIndex === -1) {
        message.error("No such blog found!");
        return;
      }

      blogs[blogIndex] = { ...blogs[blogIndex], ...updatedBlogData };

      await updateDoc(docRef, { blog: blogs });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong, cannot update the blog.");
    }
  },
  getBlogs: async (
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.blogs, id);
    try {
      const blogsDocument = await getDoc(docRef);
      setLoading(false);
      return blogsDocument.data() as { blog: BlogDetails[] };
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong, cannot fetch blogs.");
    }
  },
  getBlogById: async (
    uuid: string,
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.blogs, id);
    try {
      const blogsDocument = await getDoc(docRef);
      const { blog } = blogsDocument.data() as { blog: BlogDetails[] };
      setLoading(false);
      return blog.filter((x) => x.uuid === uuid)[0];
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong, cannot fetch blogs.");
    }
  },
  postProject: async (
    payload: IProject,
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.project, id);
    try {
      const data = await firebaseService.uploadImage(
        payload.thumbnail,
        "project-thumbnails"
      );

      if (data && data.url) {
        await setDoc(
          docRef,
          {
            project: arrayUnion({
              ...payload,
              thumbnail: { url: data.url, path: data.path },
            }),
          },
          { merge: true }
        );
        message.success("Submitted sucessfully");
      } else {
        message.success("Thumbnail upload failed, please try again.");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
      message.error(
        "Something went wrong, cannot create project. Please try again!"
      );
    }
  },
  getProjects: async (
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.project, id);
    try {
      const projectDocument = await getDoc(docRef);
      setLoading(false);
      return projectDocument.data() as { project: IProject[] };
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong, cannot fetch projects.");
    }
  },
  getProjectById: async (
    uuid: string,
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.project, id);
    try {
      const projectDocument = await getDoc(docRef);
      const { project } = projectDocument.data() as { project: IProject[] };
      setLoading(false);
      return project.filter((x) => x.uuid === uuid)[0];
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong, cannot fetch project.");
    }
  },
  updateProject: async (
    projectUuid: string,
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    updateProjectData: Partial<IProject>
  ) => {
    const docRef = doc(db, tables.project, id);

    try {
      if (updateProjectData.thumbnail?.size) {
        const data = await firebaseService.uploadImage(
          updateProjectData.thumbnail
        );

        updateProjectData.thumbnail = {
          url: data.url,
          path: data.path,
        };
      }
      const projectSnap = await getDoc(docRef);

      if (!projectSnap.exists()) {
        message.error("No such document found!");
        return;
      }

      const projects = projectSnap.data().project as IProject[];

      const projectIdx = projects.findIndex(
        (project) => project.uuid === projectUuid
      );

      if (projectIdx === -1) {
        message.error("No such project found!");
        return;
      }

      projects[projectIdx] = { ...projects[projectIdx], ...updateProjectData };

      await updateDoc(docRef, { project: projects });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong, cannot update the project.");
    }
  },
  deleteData: async (
    table: string,
    id: string,
    uuid: string,
    objectName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, table, id);

    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        message.error("No such document found!");
        return;
      }
      const document = docSnap.data()[objectName];
      const documentIdx = document.findIndex((_doc: any) => _doc.uuid === uuid);
      if (documentIdx === -1) {
        message.error("No such document found!");
        return;
      }
      if (objectName === "blog") {
        document[documentIdx] = {
          ...document[documentIdx],
          status: "Deleted",
          publsihed: false,
          feature: false,
        };
      } else {
        document[documentIdx] = { ...document[documentIdx], status: "Deleted" };
      }
      await updateDoc(docRef, { [objectName]: document });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong, deletion failed.");
    }
  },
  postExperience: async (
    payload: IExperience,
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.experience, id);
    try {
      await setDoc(docRef, {
        ...payload,
      });
      message.success("Submitted sucessfully");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Something went wrong, cannot create experience. Please try again!"
      );
    }
  },
  updateExperience: async (
    payload: IExperience,
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.experience, id);
    try {
      await updateDoc(docRef, {
        ...payload,
      });
      message.success("Updated sucessfully");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Something went wrong, cannot create experience. Please try again!"
      );
    }
  },
  deleteExperience: async (
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = doc(db, tables.experience, id);
    try {
      const data = (await getDoc(docRef)).data();
      await updateDoc(docRef, {
        ...data,
        status: status.DELETED,
      });
      message.success("Deleted sucessfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(
        "Something went wrong, cannot create experience. Please try again!"
      );
    }
  },
  getExperience: async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const docRef = query(collection(db, tables.experience));
    try {
      const experienceSnapshot = await getDocs(docRef);
      setLoading(false);
      const data: any = [];

      experienceSnapshot.forEach((doc) => {
        if (doc.exists()) {
          data.push({ ...doc.data(), uuid: doc.id });
        }
      });

      return data;
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong, cannot fetch projects.");
    }
  },
  getExperienceById: async (uuid: string) => {
    const docRef = doc(db, tables.experience, uuid);
    try {
      return (await getDoc(docRef)).data() as IExperience;
    } catch (error) {
      message.error("Something went wrong, cannot fetch projects.");
    }
  },
};
