import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const RegistrationForm = () => {
   const { t } = useTranslation();
   const { register: registerUser } = useAuth();
   const [isLoading, setIsLoading] = useState(false);

   const schema = yup
      .object({
         fname: yup.string().required().label(t("common.first_name")),
         lname: yup.string().required().label(t("common.last_name")),
         email: yup.string().required().email().label(t("common.email")),
         password: yup.string().required().min(6).label(t("common.password")),
         cpassword: yup.string()
            .required()
            .oneOf([yup.ref('password')], t("common.password_must_match"))
            .label(t("common.confirm_password")),
      })
      .required();

   const { register, handleSubmit, reset, formState: { errors }, } = useForm<any>({ resolver: yupResolver(schema), });

   const onSubmit = async (data: any) => {
      setIsLoading(true);
      try {
         await registerUser({
            name: `${data.fname} ${data.lname}`,
            email: data.email,
            password: data.password,
            role: 'student',
         });
         toast.success(t("common.registration_success"), { position: 'top-center' });
         reset();
      } catch (error: any) {
         toast.error(error.message || t("common.registration_failed"), { position: 'top-center' });
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="account__form">
         <div className="row g-3">
            <div className="col-md-6">
               <div className="form-grp mb-2">
                  <label htmlFor="fast-name" className="fw-bold small opacity-50 mb-2">{t("common.first_name")}</label>
                  <input type="text" {...register("fname")} id="fast-name" placeholder="John" style={{ width: '100%', padding: '12px 18px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.9rem' }} />
                  <p className="form_error text-danger small mt-1">{errors.fname?.message as any}</p>
               </div>
            </div>
            <div className="col-md-6">
               <div className="form-grp mb-2">
                  <label htmlFor="last-name" className="fw-bold small opacity-50 mb-2">{t("common.last_name")}</label>
                  <input type="text" {...register("lname")} id="last-name" placeholder="Doe" style={{ width: '100%', padding: '12px 18px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.9rem' }} />
                  <p className="form_error text-danger small mt-1">{errors.lname?.message as any}</p>
               </div>
            </div>
         </div>
         <div className="form-grp mb-2">
            <label htmlFor="email" className="fw-bold small opacity-50 mb-2">{t("common.email")}</label>
            <input type="email" {...register("email")} id="email" placeholder="name@example.com" style={{ width: '100%', padding: '12px 18px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.9rem' }} />
            <p className="form_error text-danger small mt-1">{errors.email?.message as any}</p>
         </div>
         <div className="form-grp mb-2">
            <label htmlFor="password" className="fw-bold small opacity-50 mb-2">{t("common.password")}</label>
            <input type="password" {...register("password")} id="password" placeholder="••••••••" style={{ width: '100%', padding: '12px 18px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.9rem' }} />
            <p className="form_error text-danger small mt-1">{errors.password?.message as any}</p>
         </div>
         <div className="form-grp mb-20">
            <label htmlFor="confirm-password" className="fw-bold small opacity-50 mb-2">{t("common.confirm_password")}</label>
            <input type="password" {...register("cpassword")} id="confirm-password" placeholder="••••••••" style={{ width: '100%', padding: '12px 18px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.9rem' }} />
            <p className="form_error text-danger small mt-1">{errors.cpassword?.message as any}</p>
         </div>
         <button type="submit" className="btn-neon-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2" disabled={isLoading} style={{ borderRadius: '12px' }}>
            {isLoading ? (
                <div className="spinner-border spinner-border-sm" role="status"></div>
            ) : (
                <>
                    {t("common.sign_up")}
                    <i className="fas fa-arrow-right"></i>
                </>
            )}
         </button>
      </form>
   )
}

export default RegistrationForm

