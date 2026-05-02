// Clinic types
export const Clinic = {
  clinicId: '',
  name: '',
  address: '',
  phone: '',
  description: '',
  createdAt: '',
  clinicImages: [],
};

export const ClinicCreateDTO = {
  name: '',
  phone: '',
  address: '',
  description: '',
  clinicImages: [],
};

export const ClinicUpdateDTO = {
  name: '',
  address: '',
  phone: '',
  clinicImamges: [],
  description: '',
};

export const ClinicInfoDTO = {
  clinicId: '',
  name: '',
  address: '',
};

export const ClinicDetailInfoDTO = {
  clinicId: '',
  name: '',
  address: '',
  description: '',
  phone: '',
  createdAt: '',
  reviews: [],
  clinicImages: [],
};