import { CalendarDays, Clock3, IdCard, MapPin } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function PatientBookingReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();

  const portalBasePath = location.pathname.startsWith("/patient/")
    ? "/patient"
    : "/p";
  const portalPath = token ? `${portalBasePath}/${token}` : portalBasePath;
  const bookingPath = token
    ? `${portalBasePath}/${token}/book`
    : `${portalBasePath}/book`;

  return (
    <div className="min-h-screen bg-[#eceef3]">
      <main className="mx-auto flex w-full max-w-150 justify-center px-4 py-10 sm:py-14 md:py-16">
        <section className="w-full rounded-xl border border-border bg-surface shadow-[0_2px_10px_rgba(15,23,42,0.08)]">
          <div className="border-b border-border p-6 text-center">
            <h2 className="text-xl font-semibold text-primary sm:text-2xl">
              Review Your Appointment
            </h2>
            <p className="mt-2 text-sm text-muted ">
              Please confirm the details below.
            </p>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1614436163996-25cee5f54290?auto=format&fit=crop&w=160&q=80"
                alt="Dr. Sarah Jenkins"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-lg leading-tight font-semibold text-primary sm:text-xl">
                  Dr. Sarah Jenkins
                </p>
                <p className="text-xs font-semibold tracking-wider text-accent uppercase">
                  Cardiology
                </p>
                <p className="text-[16px] text-muted">Westside Heart Clinic</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-base p-4">
              <div className="flex gap-3">
                <CalendarDays size={16} className="mt-0.5 text-muted" />
                <div>
                  <p className="text-xs font-semibold tracking-wider text-muted uppercase">
                    Date
                  </p>
                  <p className="text-[17px] text-primary">
                    Monday, Oct 12, 2023
                  </p>
                </div>
              </div>

              <div className="my-3 border-t border-border" />

              <div className="flex gap-3">
                <Clock3 size={16} className="mt-0.5 text-muted" />
                <div>
                  <p className="text-xs font-semibold tracking-wider text-muted uppercase">
                    Time
                  </p>
                  <p className="text-[17px] text-primary">10:15 AM</p>
                </div>
              </div>

              <div className="my-3 border-t border-border" />

              <div className="flex gap-3">
                <MapPin size={16} className="mt-0.5 text-muted" />
                <div>
                  <p className="text-xs font-semibold tracking-wider text-muted uppercase">
                    Location
                  </p>
                  <p className="text-[17px] leading-snug text-primary">
                    Westside Heart Clinic, Suite 400
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-base px-3 py-2.5">
              <div className="flex items-center gap-2 text-[18px] text-primary">
                <IdCard size={14} className="text-muted" />
                <span>Blue Shield</span>
              </div>
              <p className="text-[18px] text-primary">ID: XYZ123</p>
            </div>

            <div className="space-y-3 pt-1">
              <Button
                fullWidth
                size="lg"
                className="rounded-lg tracking-wider uppercase"
                onClick={() => navigate(portalPath)}
              >
                Confirm Booking
              </Button>
              <Button
                fullWidth
                size="lg"
                variant="ghost"
                className="rounded-lg border border-border bg-surface tracking-wider uppercase hover:bg-base"
                onClick={() => navigate(bookingPath)}
              >
                Edit Selection
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
