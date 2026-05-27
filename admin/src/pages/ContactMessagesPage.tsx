import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ContactMessagesAPI, type ApiContactMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle, Eye, Trash2, MessageSquare } from "lucide-react";

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="text-sm text-foreground break-words">{value || "-"}</p>
  </div>
);

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState<ApiContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ApiContactMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, [filterStatus]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await ContactMessagesAPI.list(filterStatus === "all" ? undefined : filterStatus);
      setMessages(data.messages || []);
    } catch (err: any) {
      toast({
        title: "Error loading contact messages",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "read" | "closed") => {
    try {
      await ContactMessagesAPI.updateStatus(id, newStatus);
      toast({ title: `Message marked as ${newStatus}` });
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      loadMessages();
    } catch (err: any) {
      toast({
        title: "Failed to update status",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await ContactMessagesAPI.delete(id);
      toast({ title: "Message deleted successfully" });
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      loadMessages();
    } catch (err: any) {
      toast({
        title: "Failed to delete message",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Contact Messages</h1>
          <p className="mt-1 text-muted-foreground">Only messages from the Contact page (/contact). Homepage enquiries appear under Enquiries.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {["all", "new", "read", "closed"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-border bg-card">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No messages found in this folder.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <Card
                    key={msg._id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`border-border p-4 cursor-pointer hover:bg-muted/30 transition flex justify-between items-center ${
                      selectedMessage?._id === msg._id ? "bg-muted/40 border-primary" : "bg-card"
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs uppercase px-2 py-0.5 rounded-full font-semibold ${
                          msg.status === "new"
                            ? "bg-emerald-500/20 text-emerald-500"
                            : msg.status === "read"
                            ? "bg-sky-500/20 text-sky-500"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {msg.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground">{msg.name}</h4>
                      <p className="text-xs text-muted-foreground">{msg.email}</p>
                      <p className="text-xs text-muted-foreground">{msg.phone || "No phone"}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-md">{msg.message}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Message Details Panel */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <Card className="border-border bg-card p-6 space-y-5 sticky top-6">
                <div className="border-b border-border pb-4">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-bold text-foreground text-xl">Contact Details</h3>
                    <span className={`text-xs uppercase px-2 py-0.5 rounded-full font-semibold ${
                      selectedMessage.status === "new"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : selectedMessage.status === "read"
                        ? "bg-sky-500/20 text-sky-500"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {selectedMessage.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : ""}
                  </p>
                </div>

                <DetailRow label="Name" value={selectedMessage.name} />
                <DetailRow label="Email" value={selectedMessage.email} />
                <DetailRow label="Phone" value={selectedMessage.phone} />
                <DetailRow label="Subject" value={selectedMessage.subject || "Contact Page Enquiry"} />

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
                  <div className="rounded-md bg-muted/40 p-4 text-sm text-foreground whitespace-pre-wrap min-h-[120px]">
                    {selectedMessage.message}
                  </div>
                </div>

                <DetailRow
                  label="Last Updated"
                  value={selectedMessage.updatedAt ? new Date(selectedMessage.updatedAt).toLocaleString() : "-"}
                />

                <div className="flex flex-wrap gap-2 pt-4 justify-end">
                  {selectedMessage.status === "new" && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedMessage._id, "read")}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" /> Mark Read
                    </Button>
                  )}
                  {selectedMessage.status !== "closed" && (
                    <Button
                      variant="default"
                      onClick={() => handleStatusChange(selectedMessage._id, "closed")}
                      className="gap-2 gradient-primary text-primary-foreground"
                    >
                      <CheckCircle className="h-4 w-4" /> Close Ticket
                    </Button>
                  )}
                  <Button variant="destructive" onClick={() => handleDelete(selectedMessage._id)} className="gap-2">
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="border-border bg-card p-6 text-center text-muted-foreground min-h-[250px] flex flex-col justify-center items-center">
                <MessageSquare className="h-8 w-8 mb-2" />
                <p>Select a message from the list to view its complete content and respond.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactMessagesPage;
