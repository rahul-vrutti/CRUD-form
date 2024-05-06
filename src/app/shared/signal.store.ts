import { withDevtools } from "@angular-architects/ngrx-toolkit";
import { inject, signal } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { UserService } from "../service/user.service";
import { ToastrService } from "ngx-toastr";

interface userData {
    userData: any
}
const UserFromSignalStore: userData = {
    userData: []
}

const initializeApp = signal(UserFromSignalStore);


export const UserStore = signalStore(
    { providedIn: 'root' },
    withDevtools('user-store'),
    withState(initializeApp),
    withMethods(store => {
        const userService = inject(UserService)
        const toster = inject(ToastrService)
        return {
            getFormData() {
                return new Promise((resolve) => {
                    userService.getUser().subscribe((res: any) => {
                        patchState(store, { userData: res.data })
                        if (res.success) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
                })
            },

            createUserData(data: any) {
                return new Promise((resolve) => {
                    userService.addUser(data).subscribe(async (res: any) => {
                        if (res.success) {
                            const newUser = {
                                user_id: res.newUser.user_id,
                                employee_id: res.newUser.employee_id,
                                user_name: res.newUser.user_name,
                                email: res.newUser.email,
                                role_id: res.newUser.role_id,
                                role_name: data.role_name,
                                pcCount: data.pc_permission.length,
                                assigned_pc: data.pc_permission
                            }
                            patchState(store, { userData: [newUser, ...store.userData()] })
                            toster.success(res.message, 'Success');
                            resolve(true)
                        } else {
                            toster.error(res.message, 'Error');
                            resolve(false)
                        }
                    }, err => {
                        console.log("err", err);
                    })
                })
            },

            updateUserData(id: number | string, data: any) {
                return new Promise((resolve) => {
                    userService.updateUser(id, data).subscribe(async (res: any) => {
                        if (res.success) {

                            for (let i = 0; i < store.userData().length; i++) {
                                if (store.userData()[i].user_id === id) {
                                    const updated_value = {
                                        ...data,
                                        assigned_pc: data.pc_permission
                                    }
                                    store.userData()[i] = { ...store.userData()[i], ...updated_value };
                                    break;
                                }
                            }
                            patchState(store, { userData: [...store.userData()] });
                            toster.success(res.message, 'Success');
                            resolve(true)
                        } else {
                            toster.error(res.message, 'Success');
                            resolve(false)
                        }
                    });
                })
            },

            deleteUserData(id: number | string) {
                return new Promise((resolve) => {
                    userService.deleteUser(id).subscribe(async (res: any) => {
                        if (res.success) {
                            const newUserData = store.userData().filter((item: any) => item.user_id !== id);
                            patchState(store, { userData: newUserData });
                            toster.success(res.message, 'Success');
                            resolve(true)
                        } else {
                            toster.error(res.message, 'Error');
                            resolve(false)
                        }
                    })
                })
            }
        }
    }
    )

)